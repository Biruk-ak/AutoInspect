import {
  assertComplianceTransition,
  buildComplianceQueryString,
  computeComplianceScore,
  filterActiveCompliance,
  groupComplianceByStatus,
  mergeComplianceTags,
  paginateCompliance,
  sortComplianceByPriority,
  summarizeComplianceList,
} from '../compliance';
import type { ComplianceBase } from '../../types/compliance';

const sample = (overrides: Partial<ComplianceBase> = {}): ComplianceBase => ({
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

describe('compliance utils', () => {
  it('builds query string', () => {
    expect(buildComplianceQueryString({ page: 1, status: 'active' })).toContain('page=1');
  });

  it('summarizes list', () => {
    const stats = summarizeComplianceList([sample(), sample({ status: 'draft', isActive: true, amount: 10 })]);
    expect(stats.total).toBe(2);
    expect(stats.averageAmount).toBeGreaterThan(0);
  });

  it('sorts by priority', () => {
    const sorted = sortComplianceByPriority([sample({ priority: 1 }), sample({ id: '2', priority: 90 })]);
    expect(sorted[0].priority).toBe(90);
  });

  it('filters active', () => {
    expect(filterActiveCompliance([sample(), sample({ isActive: false })])).toHaveLength(1);
  });

  it('merges tags', () => {
    expect(mergeComplianceTags(['A'], ['a', 'b'])).toEqual(['a', 'b']);
  });

  it('asserts transitions', () => {
    expect(() => assertComplianceTransition('draft', 'active')).not.toThrow();
    expect(() => assertComplianceTransition('archived', 'draft')).toThrow();
  });

  it('groups by status', () => {
    const groups = groupComplianceByStatus([sample(), sample({ status: 'draft' })]);
    expect(groups.active).toHaveLength(1);
  });

  it('paginates', () => {
    const result = paginateCompliance([1, 2, 3, 4, 5], 2, 2);
    expect(result.items).toEqual([3, 4]);
    expect(result.totalPages).toBe(3);
  });

  it('computes score', () => {
    expect(computeComplianceScore(sample())).toBeGreaterThan(50);
  });
});
