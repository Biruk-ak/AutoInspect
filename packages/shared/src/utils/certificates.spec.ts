import {
  assertCertificateTransition,
  buildCertificateQueryString,
  computeCertificateScore,
  filterActiveCertificate,
  groupCertificateByStatus,
  mergeCertificateTags,
  paginateCertificate,
  sortCertificateByPriority,
  summarizeCertificateList,
} from '../certificates';
import type { CertificateBase } from '../../types/certificates';

const sample = (overrides: Partial<CertificateBase> = {}): CertificateBase => ({
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

describe('certificates utils', () => {
  it('builds query string', () => {
    expect(buildCertificateQueryString({ page: 1, status: 'active' })).toContain('page=1');
  });

  it('summarizes list', () => {
    const stats = summarizeCertificateList([sample(), sample({ status: 'draft', isActive: true, amount: 10 })]);
    expect(stats.total).toBe(2);
    expect(stats.averageAmount).toBeGreaterThan(0);
  });

  it('sorts by priority', () => {
    const sorted = sortCertificateByPriority([sample({ priority: 1 }), sample({ id: '2', priority: 90 })]);
    expect(sorted[0].priority).toBe(90);
  });

  it('filters active', () => {
    expect(filterActiveCertificate([sample(), sample({ isActive: false })])).toHaveLength(1);
  });

  it('merges tags', () => {
    expect(mergeCertificateTags(['A'], ['a', 'b'])).toEqual(['a', 'b']);
  });

  it('asserts transitions', () => {
    expect(() => assertCertificateTransition('draft', 'active')).not.toThrow();
    expect(() => assertCertificateTransition('archived', 'draft')).toThrow();
  });

  it('groups by status', () => {
    const groups = groupCertificateByStatus([sample(), sample({ status: 'draft' })]);
    expect(groups.active).toHaveLength(1);
  });

  it('paginates', () => {
    const result = paginateCertificate([1, 2, 3, 4, 5], 2, 2);
    expect(result.items).toEqual([3, 4]);
    expect(result.totalPages).toBe(3);
  });

  it('computes score', () => {
    expect(computeCertificateScore(sample())).toBeGreaterThan(50);
  });
});
