import {
  assertGarageTransition,
  buildGarageQueryString,
  computeGarageScore,
  filterActiveGarage,
  groupGarageByStatus,
  mergeGarageTags,
  paginateGarage,
  sortGarageByPriority,
  summarizeGarageList,
} from '../garages';
import type { GarageBase } from '../../types/garages';

const sample = (overrides: Partial<GarageBase> = {}): GarageBase => ({
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

describe('garages utils', () => {
  it('builds query string', () => {
    expect(buildGarageQueryString({ page: 1, status: 'active' })).toContain('page=1');
  });

  it('summarizes list', () => {
    const stats = summarizeGarageList([sample(), sample({ status: 'draft', isActive: true, amount: 10 })]);
    expect(stats.total).toBe(2);
    expect(stats.averageAmount).toBeGreaterThan(0);
  });

  it('sorts by priority', () => {
    const sorted = sortGarageByPriority([sample({ priority: 1 }), sample({ id: '2', priority: 90 })]);
    expect(sorted[0].priority).toBe(90);
  });

  it('filters active', () => {
    expect(filterActiveGarage([sample(), sample({ isActive: false })])).toHaveLength(1);
  });

  it('merges tags', () => {
    expect(mergeGarageTags(['A'], ['a', 'b'])).toEqual(['a', 'b']);
  });

  it('asserts transitions', () => {
    expect(() => assertGarageTransition('draft', 'active')).not.toThrow();
    expect(() => assertGarageTransition('archived', 'draft')).toThrow();
  });

  it('groups by status', () => {
    const groups = groupGarageByStatus([sample(), sample({ status: 'draft' })]);
    expect(groups.active).toHaveLength(1);
  });

  it('paginates', () => {
    const result = paginateGarage([1, 2, 3, 4, 5], 2, 2);
    expect(result.items).toEqual([3, 4]);
    expect(result.totalPages).toBe(3);
  });

  it('computes score', () => {
    expect(computeGarageScore(sample())).toBeGreaterThan(50);
  });
});
