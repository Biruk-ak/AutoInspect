import {
  assertSettingsTransition,
  buildSettingsQueryString,
  computeSettingsScore,
  filterActiveSettings,
  groupSettingsByStatus,
  mergeSettingsTags,
  paginateSettings,
  sortSettingsByPriority,
  summarizeSettingsList,
} from '../settings';
import type { SettingsBase } from '../../types/settings';

const sample = (overrides: Partial<SettingsBase> = {}): SettingsBase => ({
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

describe('settings utils', () => {
  it('builds query string', () => {
    expect(buildSettingsQueryString({ page: 1, status: 'active' })).toContain('page=1');
  });

  it('summarizes list', () => {
    const stats = summarizeSettingsList([sample(), sample({ status: 'draft', isActive: true, amount: 10 })]);
    expect(stats.total).toBe(2);
    expect(stats.averageAmount).toBeGreaterThan(0);
  });

  it('sorts by priority', () => {
    const sorted = sortSettingsByPriority([sample({ priority: 1 }), sample({ id: '2', priority: 90 })]);
    expect(sorted[0].priority).toBe(90);
  });

  it('filters active', () => {
    expect(filterActiveSettings([sample(), sample({ isActive: false })])).toHaveLength(1);
  });

  it('merges tags', () => {
    expect(mergeSettingsTags(['A'], ['a', 'b'])).toEqual(['a', 'b']);
  });

  it('asserts transitions', () => {
    expect(() => assertSettingsTransition('draft', 'active')).not.toThrow();
    expect(() => assertSettingsTransition('archived', 'draft')).toThrow();
  });

  it('groups by status', () => {
    const groups = groupSettingsByStatus([sample(), sample({ status: 'draft' })]);
    expect(groups.active).toHaveLength(1);
  });

  it('paginates', () => {
    const result = paginateSettings([1, 2, 3, 4, 5], 2, 2);
    expect(result.items).toEqual([3, 4]);
    expect(result.totalPages).toBe(3);
  });

  it('computes score', () => {
    expect(computeSettingsScore(sample())).toBeGreaterThan(50);
  });
});
