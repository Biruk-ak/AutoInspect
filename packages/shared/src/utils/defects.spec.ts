import {
  assertDefectTransition,
  buildDefectQueryString,
  computeDefectScore,
  filterActiveDefect,
  groupDefectByStatus,
  mergeDefectTags,
  paginateDefect,
  sortDefectByPriority,
  summarizeDefectList,
} from '../defects';
import type { DefectBase } from '../../types/defects';

const sample = (overrides: Partial<DefectBase> = {}): DefectBase => ({
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

describe('defects utils', () => {
  it('builds query string', () => {
    expect(buildDefectQueryString({ page: 1, status: 'active' })).toContain('page=1');
  });

  it('summarizes list', () => {
    const stats = summarizeDefectList([sample(), sample({ status: 'draft', isActive: true, amount: 10 })]);
    expect(stats.total).toBe(2);
    expect(stats.averageAmount).toBeGreaterThan(0);
  });

  it('sorts by priority', () => {
    const sorted = sortDefectByPriority([sample({ priority: 1 }), sample({ id: '2', priority: 90 })]);
    expect(sorted[0].priority).toBe(90);
  });

  it('filters active', () => {
    expect(filterActiveDefect([sample(), sample({ isActive: false })])).toHaveLength(1);
  });

  it('merges tags', () => {
    expect(mergeDefectTags(['A'], ['a', 'b'])).toEqual(['a', 'b']);
  });

  it('asserts transitions', () => {
    expect(() => assertDefectTransition('draft', 'active')).not.toThrow();
    expect(() => assertDefectTransition('archived', 'draft')).toThrow();
  });

  it('groups by status', () => {
    const groups = groupDefectByStatus([sample(), sample({ status: 'draft' })]);
    expect(groups.active).toHaveLength(1);
  });

  it('paginates', () => {
    const result = paginateDefect([1, 2, 3, 4, 5], 2, 2);
    expect(result.items).toEqual([3, 4]);
    expect(result.totalPages).toBe(3);
  });

  it('computes score', () => {
    expect(computeDefectScore(sample())).toBeGreaterThan(50);
  });
});
