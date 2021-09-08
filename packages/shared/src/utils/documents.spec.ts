import {
  assertDocumentTransition,
  buildDocumentQueryString,
  computeDocumentScore,
  filterActiveDocument,
  groupDocumentByStatus,
  mergeDocumentTags,
  paginateDocument,
  sortDocumentByPriority,
  summarizeDocumentList,
} from '../documents';
import type { DocumentBase } from '../../types/documents';

const sample = (overrides: Partial<DocumentBase> = {}): DocumentBase => ({
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

describe('documents utils', () => {
  it('builds query string', () => {
    expect(buildDocumentQueryString({ page: 1, status: 'active' })).toContain('page=1');
  });

  it('summarizes list', () => {
    const stats = summarizeDocumentList([sample(), sample({ status: 'draft', isActive: true, amount: 10 })]);
    expect(stats.total).toBe(2);
    expect(stats.averageAmount).toBeGreaterThan(0);
  });

  it('sorts by priority', () => {
    const sorted = sortDocumentByPriority([sample({ priority: 1 }), sample({ id: '2', priority: 90 })]);
    expect(sorted[0].priority).toBe(90);
  });

  it('filters active', () => {
    expect(filterActiveDocument([sample(), sample({ isActive: false })])).toHaveLength(1);
  });

  it('merges tags', () => {
    expect(mergeDocumentTags(['A'], ['a', 'b'])).toEqual(['a', 'b']);
  });

  it('asserts transitions', () => {
    expect(() => assertDocumentTransition('draft', 'active')).not.toThrow();
    expect(() => assertDocumentTransition('archived', 'draft')).toThrow();
  });

  it('groups by status', () => {
    const groups = groupDocumentByStatus([sample(), sample({ status: 'draft' })]);
    expect(groups.active).toHaveLength(1);
  });

  it('paginates', () => {
    const result = paginateDocument([1, 2, 3, 4, 5], 2, 2);
    expect(result.items).toEqual([3, 4]);
    expect(result.totalPages).toBe(3);
  });

  it('computes score', () => {
    expect(computeDocumentScore(sample())).toBeGreaterThan(50);
  });
});
