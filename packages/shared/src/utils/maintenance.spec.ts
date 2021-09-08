import {
  assertMaintenanceTransition,
  buildMaintenanceQueryString,
  computeMaintenanceScore,
  filterActiveMaintenance,
  groupMaintenanceByStatus,
  mergeMaintenanceTags,
  paginateMaintenance,
  sortMaintenanceByPriority,
  summarizeMaintenanceList,
} from '../maintenance';
import type { MaintenanceBase } from '../../types/maintenance';

const sample = (overrides: Partial<MaintenanceBase> = {}): MaintenanceBase => ({
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

describe('maintenance utils', () => {
  it('builds query string', () => {
    expect(buildMaintenanceQueryString({ page: 1, status: 'active' })).toContain('page=1');
  });

  it('summarizes list', () => {
    const stats = summarizeMaintenanceList([sample(), sample({ status: 'draft', isActive: true, amount: 10 })]);
    expect(stats.total).toBe(2);
    expect(stats.averageAmount).toBeGreaterThan(0);
  });

  it('sorts by priority', () => {
    const sorted = sortMaintenanceByPriority([sample({ priority: 1 }), sample({ id: '2', priority: 90 })]);
    expect(sorted[0].priority).toBe(90);
  });

  it('filters active', () => {
    expect(filterActiveMaintenance([sample(), sample({ isActive: false })])).toHaveLength(1);
  });

  it('merges tags', () => {
    expect(mergeMaintenanceTags(['A'], ['a', 'b'])).toEqual(['a', 'b']);
  });

  it('asserts transitions', () => {
    expect(() => assertMaintenanceTransition('draft', 'active')).not.toThrow();
    expect(() => assertMaintenanceTransition('archived', 'draft')).toThrow();
  });

  it('groups by status', () => {
    const groups = groupMaintenanceByStatus([sample(), sample({ status: 'draft' })]);
    expect(groups.active).toHaveLength(1);
  });

  it('paginates', () => {
    const result = paginateMaintenance([1, 2, 3, 4, 5], 2, 2);
    expect(result.items).toEqual([3, 4]);
    expect(result.totalPages).toBe(3);
  });

  it('computes score', () => {
    expect(computeMaintenanceScore(sample())).toBeGreaterThan(50);
  });
});
