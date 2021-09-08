import {
  assertBookingTransition,
  buildBookingQueryString,
  computeBookingScore,
  filterActiveBooking,
  groupBookingByStatus,
  mergeBookingTags,
  paginateBooking,
  sortBookingByPriority,
  summarizeBookingList,
} from '../bookings';
import type { BookingBase } from '../../types/bookings';

const sample = (overrides: Partial<BookingBase> = {}): BookingBase => ({
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

describe('bookings utils', () => {
  it('builds query string', () => {
    expect(buildBookingQueryString({ page: 1, status: 'active' })).toContain('page=1');
  });

  it('summarizes list', () => {
    const stats = summarizeBookingList([sample(), sample({ status: 'draft', isActive: true, amount: 10 })]);
    expect(stats.total).toBe(2);
    expect(stats.averageAmount).toBeGreaterThan(0);
  });

  it('sorts by priority', () => {
    const sorted = sortBookingByPriority([sample({ priority: 1 }), sample({ id: '2', priority: 90 })]);
    expect(sorted[0].priority).toBe(90);
  });

  it('filters active', () => {
    expect(filterActiveBooking([sample(), sample({ isActive: false })])).toHaveLength(1);
  });

  it('merges tags', () => {
    expect(mergeBookingTags(['A'], ['a', 'b'])).toEqual(['a', 'b']);
  });

  it('asserts transitions', () => {
    expect(() => assertBookingTransition('draft', 'active')).not.toThrow();
    expect(() => assertBookingTransition('archived', 'draft')).toThrow();
  });

  it('groups by status', () => {
    const groups = groupBookingByStatus([sample(), sample({ status: 'draft' })]);
    expect(groups.active).toHaveLength(1);
  });

  it('paginates', () => {
    const result = paginateBooking([1, 2, 3, 4, 5], 2, 2);
    expect(result.items).toEqual([3, 4]);
    expect(result.totalPages).toBe(3);
  });

  it('computes score', () => {
    expect(computeBookingScore(sample())).toBeGreaterThan(50);
  });
});
