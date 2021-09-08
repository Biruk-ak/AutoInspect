import {
  assertWorkOrderTransition,
  buildWorkOrderQueryString,
  computeWorkOrderScore,
  filterActiveWorkOrder,
  groupWorkOrderByStatus,
  mergeWorkOrderTags,
  paginateWorkOrder,
  sortWorkOrderByPriority,
  summarizeWorkOrderList,
} from '../workorders';
import type { WorkOrderBase } from '../../types/workorders';

const sample = (overrides: Partial<WorkOrderBase> = {}): WorkOrderBase => ({
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

describe('workorders utils', () => {
  it('builds query string', () => {
    expect(buildWorkOrderQueryString({ page: 1, status: 'active' })).toContain('page=1');
  });

  it('summarizes list', () => {
    const stats = summarizeWorkOrderList([sample(), sample({ status: 'draft', isActive: true, amount: 10 })]);
    expect(stats.total).toBe(2);
    expect(stats.averageAmount).toBeGreaterThan(0);
  });

  it('sorts by priority', () => {
    const sorted = sortWorkOrderByPriority([sample({ priority: 1 }), sample({ id: '2', priority: 90 })]);
    expect(sorted[0].priority).toBe(90);
  });

  it('filters active', () => {
    expect(filterActiveWorkOrder([sample(), sample({ isActive: false })])).toHaveLength(1);
  });

  it('merges tags', () => {
    expect(mergeWorkOrderTags(['A'], ['a', 'b'])).toEqual(['a', 'b']);
  });

  it('asserts transitions', () => {
    expect(() => assertWorkOrderTransition('draft', 'active')).not.toThrow();
    expect(() => assertWorkOrderTransition('archived', 'draft')).toThrow();
  });

  it('groups by status', () => {
    const groups = groupWorkOrderByStatus([sample(), sample({ status: 'draft' })]);
    expect(groups.active).toHaveLength(1);
  });

  it('paginates', () => {
    const result = paginateWorkOrder([1, 2, 3, 4, 5], 2, 2);
    expect(result.items).toEqual([3, 4]);
    expect(result.totalPages).toBe(3);
  });

  it('computes score', () => {
    expect(computeWorkOrderScore(sample())).toBeGreaterThan(50);
  });
});
