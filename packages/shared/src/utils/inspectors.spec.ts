import {
  assertInspectorTransition,
  buildInspectorQueryString,
  computeInspectorScore,
  filterActiveInspector,
  groupInspectorByStatus,
  mergeInspectorTags,
  paginateInspector,
  sortInspectorByPriority,
  summarizeInspectorList,
} from '../inspectors';
import type { InspectorBase } from '../../types/inspectors';

const sample = (overrides: Partial<InspectorBase> = {}): InspectorBase => ({
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

describe('inspectors utils', () => {
  it('builds query string', () => {
    expect(buildInspectorQueryString({ page: 1, status: 'active' })).toContain('page=1');
  });

  it('summarizes list', () => {
    const stats = summarizeInspectorList([sample(), sample({ status: 'draft', isActive: true, amount: 10 })]);
    expect(stats.total).toBe(2);
    expect(stats.averageAmount).toBeGreaterThan(0);
  });

  it('sorts by priority', () => {
    const sorted = sortInspectorByPriority([sample({ priority: 1 }), sample({ id: '2', priority: 90 })]);
    expect(sorted[0].priority).toBe(90);
  });

  it('filters active', () => {
    expect(filterActiveInspector([sample(), sample({ isActive: false })])).toHaveLength(1);
  });

  it('merges tags', () => {
    expect(mergeInspectorTags(['A'], ['a', 'b'])).toEqual(['a', 'b']);
  });

  it('asserts transitions', () => {
    expect(() => assertInspectorTransition('draft', 'active')).not.toThrow();
    expect(() => assertInspectorTransition('archived', 'draft')).toThrow();
  });

  it('groups by status', () => {
    const groups = groupInspectorByStatus([sample(), sample({ status: 'draft' })]);
    expect(groups.active).toHaveLength(1);
  });

  it('paginates', () => {
    const result = paginateInspector([1, 2, 3, 4, 5], 2, 2);
    expect(result.items).toEqual([3, 4]);
    expect(result.totalPages).toBe(3);
  });

  it('computes score', () => {
    expect(computeInspectorScore(sample())).toBeGreaterThan(50);
  });
});
