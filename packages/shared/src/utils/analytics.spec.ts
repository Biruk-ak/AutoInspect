import {
  assertAnalyticsTransition,
  buildAnalyticsQueryString,
  computeAnalyticsScore,
  filterActiveAnalytics,
  groupAnalyticsByStatus,
  mergeAnalyticsTags,
  paginateAnalytics,
  sortAnalyticsByPriority,
  summarizeAnalyticsList,
} from '../analytics';
import type { AnalyticsBase } from '../../types/analytics';

const sample = (overrides: Partial<AnalyticsBase> = {}): AnalyticsBase => ({
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

describe('analytics utils', () => {
  it('builds query string', () => {
    expect(buildAnalyticsQueryString({ page: 1, status: 'active' })).toContain('page=1');
  });

  it('summarizes list', () => {
    const stats = summarizeAnalyticsList([sample(), sample({ status: 'draft', isActive: true, amount: 10 })]);
    expect(stats.total).toBe(2);
    expect(stats.averageAmount).toBeGreaterThan(0);
  });

  it('sorts by priority', () => {
    const sorted = sortAnalyticsByPriority([sample({ priority: 1 }), sample({ id: '2', priority: 90 })]);
    expect(sorted[0].priority).toBe(90);
  });

  it('filters active', () => {
    expect(filterActiveAnalytics([sample(), sample({ isActive: false })])).toHaveLength(1);
  });

  it('merges tags', () => {
    expect(mergeAnalyticsTags(['A'], ['a', 'b'])).toEqual(['a', 'b']);
  });

  it('asserts transitions', () => {
    expect(() => assertAnalyticsTransition('draft', 'active')).not.toThrow();
    expect(() => assertAnalyticsTransition('archived', 'draft')).toThrow();
  });

  it('groups by status', () => {
    const groups = groupAnalyticsByStatus([sample(), sample({ status: 'draft' })]);
    expect(groups.active).toHaveLength(1);
  });

  it('paginates', () => {
    const result = paginateAnalytics([1, 2, 3, 4, 5], 2, 2);
    expect(result.items).toEqual([3, 4]);
    expect(result.totalPages).toBe(3);
  });

  it('computes score', () => {
    expect(computeAnalyticsScore(sample())).toBeGreaterThan(50);
  });
});
