import {
  assertVehicleTransition,
  buildVehicleQueryString,
  computeVehicleScore,
  filterActiveVehicle,
  groupVehicleByStatus,
  mergeVehicleTags,
  paginateVehicle,
  sortVehicleByPriority,
  summarizeVehicleList,
} from '../vehicles';
import type { VehicleBase } from '../../types/vehicles';

const sample = (overrides: Partial<VehicleBase> = {}): VehicleBase => ({
  id: '1',
  status: 'active',
  metadata: {},
  organizationId: 'org',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  version: 1,
  isActive: true,
  isDeleted: false,
  priority: 50,
  tags: ['urgent'],
  amount: 1200,
  ...overrides,
});

describe('vehicles utils', () => {
  it('builds query string', () => {
    expect(buildVehicleQueryString({ page: 1, status: 'active' })).toContain('page=1');
  });

  it('summarizes list', () => {
    const stats = summarizeVehicleList([sample(), sample({ status: 'draft', isActive: true, amount: 10 })]);
    expect(stats.total).toBe(2);
    expect(stats.averageAmount).toBeGreaterThan(0);
  });

  it('sorts by priority', () => {
    const sorted = sortVehicleByPriority([sample({ priority: 1 }), sample({ id: '2', priority: 90 })]);
    expect(sorted[0].priority).toBe(90);
  });

  it('filters active', () => {
    expect(filterActiveVehicle([sample(), sample({ isActive: false })])).toHaveLength(1);
  });

  it('merges tags', () => {
    expect(mergeVehicleTags(['A'], ['a', 'b'])).toEqual(['a', 'b']);
  });

  it('asserts transitions', () => {
    expect(() => assertVehicleTransition('draft', 'active')).not.toThrow();
    expect(() => assertVehicleTransition('archived', 'draft')).toThrow();
  });

  it('groups by status', () => {
    const groups = groupVehicleByStatus([sample(), sample({ status: 'draft' })]);
    expect(groups.active).toHaveLength(1);
  });

  it('paginates', () => {
    const result = paginateVehicle([1, 2, 3, 4, 5], 2, 2);
    expect(result.items).toEqual([3, 4]);
    expect(result.totalPages).toBe(3);
  });

  it('computes score', () => {
    expect(computeVehicleScore(sample())).toBeGreaterThan(50);
  });
});
