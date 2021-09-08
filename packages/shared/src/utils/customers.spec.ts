import {
  assertCustomerTransition,
  buildCustomerQueryString,
  computeCustomerScore,
  filterActiveCustomer,
  groupCustomerByStatus,
  mergeCustomerTags,
  paginateCustomer,
  sortCustomerByPriority,
  summarizeCustomerList,
} from '../customers';
import type { CustomerBase } from '../../types/customers';

const sample = (overrides: Partial<CustomerBase> = {}): CustomerBase => ({
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

describe('customers utils', () => {
  it('builds query string', () => {
    expect(buildCustomerQueryString({ page: 1, status: 'active' })).toContain('page=1');
  });

  it('summarizes list', () => {
    const stats = summarizeCustomerList([sample(), sample({ status: 'draft', isActive: true, amount: 10 })]);
    expect(stats.total).toBe(2);
    expect(stats.averageAmount).toBeGreaterThan(0);
  });

  it('sorts by priority', () => {
    const sorted = sortCustomerByPriority([sample({ priority: 1 }), sample({ id: '2', priority: 90 })]);
    expect(sorted[0].priority).toBe(90);
  });

  it('filters active', () => {
    expect(filterActiveCustomer([sample(), sample({ isActive: false })])).toHaveLength(1);
  });

  it('merges tags', () => {
    expect(mergeCustomerTags(['A'], ['a', 'b'])).toEqual(['a', 'b']);
  });

  it('asserts transitions', () => {
    expect(() => assertCustomerTransition('draft', 'active')).not.toThrow();
    expect(() => assertCustomerTransition('archived', 'draft')).toThrow();
  });

  it('groups by status', () => {
    const groups = groupCustomerByStatus([sample(), sample({ status: 'draft' })]);
    expect(groups.active).toHaveLength(1);
  });

  it('paginates', () => {
    const result = paginateCustomer([1, 2, 3, 4, 5], 2, 2);
    expect(result.items).toEqual([3, 4]);
    expect(result.totalPages).toBe(3);
  });

  it('computes score', () => {
    expect(computeCustomerScore(sample())).toBeGreaterThan(50);
  });
});
