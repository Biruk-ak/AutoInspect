import {
  assertReviewTransition,
  buildReviewQueryString,
  computeReviewScore,
  filterActiveReview,
  groupReviewByStatus,
  mergeReviewTags,
  paginateReview,
  sortReviewByPriority,
  summarizeReviewList,
} from '../reviews';
import type { ReviewBase } from '../../types/reviews';

const sample = (overrides: Partial<ReviewBase> = {}): ReviewBase => ({
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

describe('reviews utils', () => {
  it('builds query string', () => {
    expect(buildReviewQueryString({ page: 1, status: 'active' })).toContain('page=1');
  });

  it('summarizes list', () => {
    const stats = summarizeReviewList([sample(), sample({ status: 'draft', isActive: true, amount: 10 })]);
    expect(stats.total).toBe(2);
    expect(stats.averageAmount).toBeGreaterThan(0);
  });

  it('sorts by priority', () => {
    const sorted = sortReviewByPriority([sample({ priority: 1 }), sample({ id: '2', priority: 90 })]);
    expect(sorted[0].priority).toBe(90);
  });

  it('filters active', () => {
    expect(filterActiveReview([sample(), sample({ isActive: false })])).toHaveLength(1);
  });

  it('merges tags', () => {
    expect(mergeReviewTags(['A'], ['a', 'b'])).toEqual(['a', 'b']);
  });

  it('asserts transitions', () => {
    expect(() => assertReviewTransition('draft', 'active')).not.toThrow();
    expect(() => assertReviewTransition('archived', 'draft')).toThrow();
  });

  it('groups by status', () => {
    const groups = groupReviewByStatus([sample(), sample({ status: 'draft' })]);
    expect(groups.active).toHaveLength(1);
  });

  it('paginates', () => {
    const result = paginateReview([1, 2, 3, 4, 5], 2, 2);
    expect(result.items).toEqual([3, 4]);
    expect(result.totalPages).toBe(3);
  });

  it('computes score', () => {
    expect(computeReviewScore(sample())).toBeGreaterThan(50);
  });
});
