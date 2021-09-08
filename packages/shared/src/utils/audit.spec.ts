import {
  assertAuditTransition,
  buildAuditQueryString,
  computeAuditScore,
  filterActiveAudit,
  groupAuditByStatus,
  mergeAuditTags,
  paginateAudit,
  sortAuditByPriority,
  summarizeAuditList,
} from '../audit';
import type { AuditBase } from '../../types/audit';

const sample = (overrides: Partial<AuditBase> = {}): AuditBase => ({
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

describe('audit utils', () => {
  it('builds query string', () => {
    expect(buildAuditQueryString({ page: 1, status: 'active' })).toContain('page=1');
  });

  it('summarizes list', () => {
    const stats = summarizeAuditList([sample(), sample({ status: 'draft', isActive: true, amount: 10 })]);
    expect(stats.total).toBe(2);
    expect(stats.averageAmount).toBeGreaterThan(0);
  });

  it('sorts by priority', () => {
    const sorted = sortAuditByPriority([sample({ priority: 1 }), sample({ id: '2', priority: 90 })]);
    expect(sorted[0].priority).toBe(90);
  });

  it('filters active', () => {
    expect(filterActiveAudit([sample(), sample({ isActive: false })])).toHaveLength(1);
  });

  it('merges tags', () => {
    expect(mergeAuditTags(['A'], ['a', 'b'])).toEqual(['a', 'b']);
  });

  it('asserts transitions', () => {
    expect(() => assertAuditTransition('draft', 'active')).not.toThrow();
    expect(() => assertAuditTransition('archived', 'draft')).toThrow();
  });

  it('groups by status', () => {
    const groups = groupAuditByStatus([sample(), sample({ status: 'draft' })]);
    expect(groups.active).toHaveLength(1);
  });

  it('paginates', () => {
    const result = paginateAudit([1, 2, 3, 4, 5], 2, 2);
    expect(result.items).toEqual([3, 4]);
    expect(result.totalPages).toBe(3);
  });

  it('computes score', () => {
    expect(computeAuditScore(sample())).toBeGreaterThan(50);
  });
});
