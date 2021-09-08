import {
  assertInspectionTransition,
  buildInspectionQueryString,
  computeInspectionScore,
  filterActiveInspection,
  groupInspectionByStatus,
  mergeInspectionTags,
  paginateInspection,
  sortInspectionByPriority,
  summarizeInspectionList,
} from '../inspections';
import type { InspectionBase } from '../../types/inspections';

const sample = (overrides: Partial<InspectionBase> = {}): InspectionBase => ({
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

describe('inspections utils', () => {
  it('builds query string', () => {
    expect(buildInspectionQueryString({ page: 1, status: 'active' })).toContain('page=1');
  });

  it('summarizes list', () => {
    const stats = summarizeInspectionList([sample(), sample({ status: 'draft', isActive: true, amount: 10 })]);
    expect(stats.total).toBe(2);
    expect(stats.averageAmount).toBeGreaterThan(0);
  });

  it('sorts by priority', () => {
    const sorted = sortInspectionByPriority([sample({ priority: 1 }), sample({ id: '2', priority: 90 })]);
    expect(sorted[0].priority).toBe(90);
  });

  it('filters active', () => {
    expect(filterActiveInspection([sample(), sample({ isActive: false })])).toHaveLength(1);
  });

  it('merges tags', () => {
    expect(mergeInspectionTags(['A'], ['a', 'b'])).toEqual(['a', 'b']);
  });

  it('asserts transitions', () => {
    expect(() => assertInspectionTransition('draft', 'active')).not.toThrow();
    expect(() => assertInspectionTransition('archived', 'draft')).toThrow();
  });

  it('groups by status', () => {
    const groups = groupInspectionByStatus([sample(), sample({ status: 'draft' })]);
    expect(groups.active).toHaveLength(1);
  });

  it('paginates', () => {
    const result = paginateInspection([1, 2, 3, 4, 5], 2, 2);
    expect(result.items).toEqual([3, 4]);
    expect(result.totalPages).toBe(3);
  });

  it('computes score', () => {
    expect(computeInspectionScore(sample())).toBeGreaterThan(50);
  });
});
