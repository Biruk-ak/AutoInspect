import {
  assertNotificationTransition,
  buildNotificationQueryString,
  computeNotificationScore,
  filterActiveNotification,
  groupNotificationByStatus,
  mergeNotificationTags,
  paginateNotification,
  sortNotificationByPriority,
  summarizeNotificationList,
} from '../notifications';
import type { NotificationBase } from '../../types/notifications';

const sample = (overrides: Partial<NotificationBase> = {}): NotificationBase => ({
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

describe('notifications utils', () => {
  it('builds query string', () => {
    expect(buildNotificationQueryString({ page: 1, status: 'active' })).toContain('page=1');
  });

  it('summarizes list', () => {
    const stats = summarizeNotificationList([sample(), sample({ status: 'draft', isActive: true, amount: 10 })]);
    expect(stats.total).toBe(2);
    expect(stats.averageAmount).toBeGreaterThan(0);
  });

  it('sorts by priority', () => {
    const sorted = sortNotificationByPriority([sample({ priority: 1 }), sample({ id: '2', priority: 90 })]);
    expect(sorted[0].priority).toBe(90);
  });

  it('filters active', () => {
    expect(filterActiveNotification([sample(), sample({ isActive: false })])).toHaveLength(1);
  });

  it('merges tags', () => {
    expect(mergeNotificationTags(['A'], ['a', 'b'])).toEqual(['a', 'b']);
  });

  it('asserts transitions', () => {
    expect(() => assertNotificationTransition('draft', 'active')).not.toThrow();
    expect(() => assertNotificationTransition('archived', 'draft')).toThrow();
  });

  it('groups by status', () => {
    const groups = groupNotificationByStatus([sample(), sample({ status: 'draft' })]);
    expect(groups.active).toHaveLength(1);
  });

  it('paginates', () => {
    const result = paginateNotification([1, 2, 3, 4, 5], 2, 2);
    expect(result.items).toEqual([3, 4]);
    expect(result.totalPages).toBe(3);
  });

  it('computes score', () => {
    expect(computeNotificationScore(sample())).toBeGreaterThan(50);
  });
});
