import {
  assertChecklistTransition,
  buildChecklistQueryString,
  computeChecklistScore,
  filterActiveChecklist,
  groupChecklistByStatus,
  mergeChecklistTags,
  paginateChecklist,
  sortChecklistByPriority,
  summarizeChecklistList,
} from '../checklists';
import type { ChecklistBase } from '../../types/checklists';

const sample = (overrides: Partial<ChecklistBase> = {}): ChecklistBase => ({
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

describe('checklists utils', () => {
  it('builds query string', () => {
    expect(buildChecklistQueryString({ page: 1, status: 'active' })).toContain('page=1');
  });

  it('summarizes list', () => {
    const stats = summarizeChecklistList([sample(), sample({ status: 'draft', isActive: true, amount: 10 })]);
    expect(stats.total).toBe(2);
    expect(stats.averageAmount).toBeGreaterThan(0);
  });

  it('sorts by priority', () => {
    const sorted = sortChecklistByPriority([sample({ priority: 1 }), sample({ id: '2', priority: 90 })]);
    expect(sorted[0].priority).toBe(90);
  });

  it('filters active', () => {
    expect(filterActiveChecklist([sample(), sample({ isActive: false })])).toHaveLength(1);
  });

  it('merges tags', () => {
    expect(mergeChecklistTags(['A'], ['a', 'b'])).toEqual(['a', 'b']);
  });

  it('asserts transitions', () => {
    expect(() => assertChecklistTransition('draft', 'active')).not.toThrow();
    expect(() => assertChecklistTransition('archived', 'draft')).toThrow();
  });

  it('groups by status', () => {
    const groups = groupChecklistByStatus([sample(), sample({ status: 'draft' })]);
    expect(groups.active).toHaveLength(1);
  });

  it('paginates', () => {
    const result = paginateChecklist([1, 2, 3, 4, 5], 2, 2);
    expect(result.items).toEqual([3, 4]);
    expect(result.totalPages).toBe(3);
  });

  it('computes score', () => {
    expect(computeChecklistScore(sample())).toBeGreaterThan(50);
  });
});
