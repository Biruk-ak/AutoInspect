import {
  assertPaymentTransition,
  buildPaymentQueryString,
  computePaymentScore,
  filterActivePayment,
  groupPaymentByStatus,
  mergePaymentTags,
  paginatePayment,
  sortPaymentByPriority,
  summarizePaymentList,
} from '../payments';
import type { PaymentBase } from '../../types/payments';

const sample = (overrides: Partial<PaymentBase> = {}): PaymentBase => ({
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

describe('payments utils', () => {
  it('builds query string', () => {
    expect(buildPaymentQueryString({ page: 1, status: 'active' })).toContain('page=1');
  });

  it('summarizes list', () => {
    const stats = summarizePaymentList([sample(), sample({ status: 'draft', isActive: true, amount: 10 })]);
    expect(stats.total).toBe(2);
    expect(stats.averageAmount).toBeGreaterThan(0);
  });

  it('sorts by priority', () => {
    const sorted = sortPaymentByPriority([sample({ priority: 1 }), sample({ id: '2', priority: 90 })]);
    expect(sorted[0].priority).toBe(90);
  });

  it('filters active', () => {
    expect(filterActivePayment([sample(), sample({ isActive: false })])).toHaveLength(1);
  });

  it('merges tags', () => {
    expect(mergePaymentTags(['A'], ['a', 'b'])).toEqual(['a', 'b']);
  });

  it('asserts transitions', () => {
    expect(() => assertPaymentTransition('draft', 'active')).not.toThrow();
    expect(() => assertPaymentTransition('archived', 'draft')).toThrow();
  });

  it('groups by status', () => {
    const groups = groupPaymentByStatus([sample(), sample({ status: 'draft' })]);
    expect(groups.active).toHaveLength(1);
  });

  it('paginates', () => {
    const result = paginatePayment([1, 2, 3, 4, 5], 2, 2);
    expect(result.items).toEqual([3, 4]);
    expect(result.totalPages).toBe(3);
  });

  it('computes score', () => {
    expect(computePaymentScore(sample())).toBeGreaterThan(50);
  });
});
