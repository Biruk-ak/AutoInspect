import {
  assertInventoryTransition,
  buildInventoryQueryString,
  computeInventoryScore,
  filterActiveInventory,
  groupInventoryByStatus,
  mergeInventoryTags,
  paginateInventory,
  sortInventoryByPriority,
  summarizeInventoryList,
} from '../inventory';
import type { InventoryBase } from '../../types/inventory';

const sample = (overrides: Partial<InventoryBase> = {}): InventoryBase => ({
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

describe('inventory utils', () => {
  it('builds query string', () => {
    expect(buildInventoryQueryString({ page: 1, status: 'active' })).toContain('page=1');
  });

  it('summarizes list', () => {
    const stats = summarizeInventoryList([sample(), sample({ status: 'draft', isActive: true, amount: 10 })]);
    expect(stats.total).toBe(2);
    expect(stats.averageAmount).toBeGreaterThan(0);
  });

  it('sorts by priority', () => {
    const sorted = sortInventoryByPriority([sample({ priority: 1 }), sample({ id: '2', priority: 90 })]);
    expect(sorted[0].priority).toBe(90);
  });

  it('filters active', () => {
    expect(filterActiveInventory([sample(), sample({ isActive: false })])).toHaveLength(1);
  });

  it('merges tags', () => {
    expect(mergeInventoryTags(['A'], ['a', 'b'])).toEqual(['a', 'b']);
  });

  it('asserts transitions', () => {
    expect(() => assertInventoryTransition('draft', 'active')).not.toThrow();
    expect(() => assertInventoryTransition('archived', 'draft')).toThrow();
  });

  it('groups by status', () => {
    const groups = groupInventoryByStatus([sample(), sample({ status: 'draft' })]);
    expect(groups.active).toHaveLength(1);
  });

  it('paginates', () => {
    const result = paginateInventory([1, 2, 3, 4, 5], 2, 2);
    expect(result.items).toEqual([3, 4]);
    expect(result.totalPages).toBe(3);
  });

  it('computes score', () => {
    expect(computeInventoryScore(sample())).toBeGreaterThan(50);
  });
});
