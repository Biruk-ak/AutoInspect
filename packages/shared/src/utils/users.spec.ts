import {
  assertUserTransition,
  buildUserQueryString,
  computeUserScore,
  filterActiveUser,
  groupUserByStatus,
  mergeUserTags,
  paginateUser,
  sortUserByPriority,
  summarizeUserList,
} from '../users';
import type { UserBase } from '../../types/users';

const sample = (overrides: Partial<UserBase> = {}): UserBase => ({
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

describe('users utils', () => {
  it('builds query string', () => {
    expect(buildUserQueryString({ page: 1, status: 'active' })).toContain('page=1');
  });

  it('summarizes list', () => {
    const stats = summarizeUserList([sample(), sample({ status: 'draft', isActive: true, amount: 10 })]);
    expect(stats.total).toBe(2);
    expect(stats.averageAmount).toBeGreaterThan(0);
  });

  it('sorts by priority', () => {
    const sorted = sortUserByPriority([sample({ priority: 1 }), sample({ id: '2', priority: 90 })]);
    expect(sorted[0].priority).toBe(90);
  });

  it('filters active', () => {
    expect(filterActiveUser([sample(), sample({ isActive: false })])).toHaveLength(1);
  });

  it('merges tags', () => {
    expect(mergeUserTags(['A'], ['a', 'b'])).toEqual(['a', 'b']);
  });

  it('asserts transitions', () => {
    expect(() => assertUserTransition('draft', 'active')).not.toThrow();
    expect(() => assertUserTransition('archived', 'draft')).toThrow();
  });

  it('groups by status', () => {
    const groups = groupUserByStatus([sample(), sample({ status: 'draft' })]);
    expect(groups.active).toHaveLength(1);
  });

  it('paginates', () => {
    const result = paginateUser([1, 2, 3, 4, 5], 2, 2);
    expect(result.items).toEqual([3, 4]);
    expect(result.totalPages).toBe(3);
  });

  it('computes score', () => {
    expect(computeUserScore(sample())).toBeGreaterThan(50);
  });
});
