import {
  assertPhotoTransition,
  buildPhotoQueryString,
  computePhotoScore,
  filterActivePhoto,
  groupPhotoByStatus,
  mergePhotoTags,
  paginatePhoto,
  sortPhotoByPriority,
  summarizePhotoList,
} from '../photos';
import type { PhotoBase } from '../../types/photos';

const sample = (overrides: Partial<PhotoBase> = {}): PhotoBase => ({
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

describe('photos utils', () => {
  it('builds query string', () => {
    expect(buildPhotoQueryString({ page: 1, status: 'active' })).toContain('page=1');
  });

  it('summarizes list', () => {
    const stats = summarizePhotoList([sample(), sample({ status: 'draft', isActive: true, amount: 10 })]);
    expect(stats.total).toBe(2);
    expect(stats.averageAmount).toBeGreaterThan(0);
  });

  it('sorts by priority', () => {
    const sorted = sortPhotoByPriority([sample({ priority: 1 }), sample({ id: '2', priority: 90 })]);
    expect(sorted[0].priority).toBe(90);
  });

  it('filters active', () => {
    expect(filterActivePhoto([sample(), sample({ isActive: false })])).toHaveLength(1);
  });

  it('merges tags', () => {
    expect(mergePhotoTags(['A'], ['a', 'b'])).toEqual(['a', 'b']);
  });

  it('asserts transitions', () => {
    expect(() => assertPhotoTransition('draft', 'active')).not.toThrow();
    expect(() => assertPhotoTransition('archived', 'draft')).toThrow();
  });

  it('groups by status', () => {
    const groups = groupPhotoByStatus([sample(), sample({ status: 'draft' })]);
    expect(groups.active).toHaveLength(1);
  });

  it('paginates', () => {
    const result = paginatePhoto([1, 2, 3, 4, 5], 2, 2);
    expect(result.items).toEqual([3, 4]);
    expect(result.totalPages).toBe(3);
  });

  it('computes score', () => {
    expect(computePhotoScore(sample())).toBeGreaterThan(50);
  });
});
