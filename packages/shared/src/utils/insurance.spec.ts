import {
  assertInsuranceTransition,
  buildInsuranceQueryString,
  computeInsuranceScore,
  filterActiveInsurance,
  groupInsuranceByStatus,
  mergeInsuranceTags,
  paginateInsurance,
  sortInsuranceByPriority,
  summarizeInsuranceList,
} from '../insurance';
import type { InsuranceBase } from '../../types/insurance';

const sample = (overrides: Partial<InsuranceBase> = {}): InsuranceBase => ({
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

describe('insurance utils', () => {
  it('builds query string', () => {
    expect(buildInsuranceQueryString({ page: 1, status: 'active' })).toContain('page=1');
  });

  it('summarizes list', () => {
    const stats = summarizeInsuranceList([sample(), sample({ status: 'draft', isActive: true, amount: 10 })]);
    expect(stats.total).toBe(2);
    expect(stats.averageAmount).toBeGreaterThan(0);
  });

  it('sorts by priority', () => {
    const sorted = sortInsuranceByPriority([sample({ priority: 1 }), sample({ id: '2', priority: 90 })]);
    expect(sorted[0].priority).toBe(90);
  });

  it('filters active', () => {
    expect(filterActiveInsurance([sample(), sample({ isActive: false })])).toHaveLength(1);
  });

  it('merges tags', () => {
    expect(mergeInsuranceTags(['A'], ['a', 'b'])).toEqual(['a', 'b']);
  });

  it('asserts transitions', () => {
    expect(() => assertInsuranceTransition('draft', 'active')).not.toThrow();
    expect(() => assertInsuranceTransition('archived', 'draft')).toThrow();
  });

  it('groups by status', () => {
    const groups = groupInsuranceByStatus([sample(), sample({ status: 'draft' })]);
    expect(groups.active).toHaveLength(1);
  });

  it('paginates', () => {
    const result = paginateInsurance([1, 2, 3, 4, 5], 2, 2);
    expect(result.items).toEqual([3, 4]);
    expect(result.totalPages).toBe(3);
  });

  it('computes score', () => {
    expect(computeInsuranceScore(sample())).toBeGreaterThan(50);
  });
});
