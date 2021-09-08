import {
  assertMessageTransition,
  buildMessageQueryString,
  computeMessageScore,
  filterActiveMessage,
  groupMessageByStatus,
  mergeMessageTags,
  paginateMessage,
  sortMessageByPriority,
  summarizeMessageList,
} from '../messages';
import type { MessageBase } from '../../types/messages';

const sample = (overrides: Partial<MessageBase> = {}): MessageBase => ({
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

describe('messages utils', () => {
  it('builds query string', () => {
    expect(buildMessageQueryString({ page: 1, status: 'active' })).toContain('page=1');
  });

  it('summarizes list', () => {
    const stats = summarizeMessageList([sample(), sample({ status: 'draft', isActive: true, amount: 10 })]);
    expect(stats.total).toBe(2);
    expect(stats.averageAmount).toBeGreaterThan(0);
  });

  it('sorts by priority', () => {
    const sorted = sortMessageByPriority([sample({ priority: 1 }), sample({ id: '2', priority: 90 })]);
    expect(sorted[0].priority).toBe(90);
  });

  it('filters active', () => {
    expect(filterActiveMessage([sample(), sample({ isActive: false })])).toHaveLength(1);
  });

  it('merges tags', () => {
    expect(mergeMessageTags(['A'], ['a', 'b'])).toEqual(['a', 'b']);
  });

  it('asserts transitions', () => {
    expect(() => assertMessageTransition('draft', 'active')).not.toThrow();
    expect(() => assertMessageTransition('archived', 'draft')).toThrow();
  });

  it('groups by status', () => {
    const groups = groupMessageByStatus([sample(), sample({ status: 'draft' })]);
    expect(groups.active).toHaveLength(1);
  });

  it('paginates', () => {
    const result = paginateMessage([1, 2, 3, 4, 5], 2, 2);
    expect(result.items).toEqual([3, 4]);
    expect(result.totalPages).toBe(3);
  });

  it('computes score', () => {
    expect(computeMessageScore(sample())).toBeGreaterThan(50);
  });
});
