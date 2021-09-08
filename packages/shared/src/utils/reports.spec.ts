import {
  assertReportTransition,
  buildReportQueryString,
  computeReportScore,
  filterActiveReport,
  groupReportByStatus,
  mergeReportTags,
  paginateReport,
  sortReportByPriority,
  summarizeReportList,
} from '../reports';
import type { ReportBase } from '../../types/reports';

const sample = (overrides: Partial<ReportBase> = {}): ReportBase => ({
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

describe('reports utils', () => {
  it('builds query string', () => {
    expect(buildReportQueryString({ page: 1, status: 'active' })).toContain('page=1');
  });

  it('summarizes list', () => {
    const stats = summarizeReportList([sample(), sample({ status: 'draft', isActive: true, amount: 10 })]);
    expect(stats.total).toBe(2);
    expect(stats.averageAmount).toBeGreaterThan(0);
  });

  it('sorts by priority', () => {
    const sorted = sortReportByPriority([sample({ priority: 1 }), sample({ id: '2', priority: 90 })]);
    expect(sorted[0].priority).toBe(90);
  });

  it('filters active', () => {
    expect(filterActiveReport([sample(), sample({ isActive: false })])).toHaveLength(1);
  });

  it('merges tags', () => {
    expect(mergeReportTags(['A'], ['a', 'b'])).toEqual(['a', 'b']);
  });

  it('asserts transitions', () => {
    expect(() => assertReportTransition('draft', 'active')).not.toThrow();
    expect(() => assertReportTransition('archived', 'draft')).toThrow();
  });

  it('groups by status', () => {
    const groups = groupReportByStatus([sample(), sample({ status: 'draft' })]);
    expect(groups.active).toHaveLength(1);
  });

  it('paginates', () => {
    const result = paginateReport([1, 2, 3, 4, 5], 2, 2);
    expect(result.items).toEqual([3, 4]);
    expect(result.totalPages).toBe(3);
  });

  it('computes score', () => {
    expect(computeReportScore(sample())).toBeGreaterThan(50);
  });
});
