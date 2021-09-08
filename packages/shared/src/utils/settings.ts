import type { SettingsBase, SettingsFilters, SettingsStats } from '../types/settings';
import { canTransitionSettings, isTerminalSettingsStatus, normalizeSettingsTags } from '../types/settings';

export function buildSettingsQueryString(filters: SettingsFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

export function summarizeSettingsList(items: SettingsBase[]): SettingsStats {
  const byStatus: Record<string, number> = {};
  let amountSum = 0;
  let active = 0;
  for (const item of items) {
    byStatus[item.status] = (byStatus[item.status] || 0) + 1;
    amountSum += item.amount || 0;
    if (item.isActive && !isTerminalSettingsStatus(item.status)) active += 1;
  }
  return {
    byStatus,
    total: items.length,
    active,
    averageAmount: items.length ? amountSum / items.length : 0,
  };
}

export function sortSettingsByPriority(items: SettingsBase[]): SettingsBase[] {
  return [...items].sort((a, b) => b.priority - a.priority);
}

export function filterActiveSettings(items: SettingsBase[]): SettingsBase[] {
  return items.filter((i) => i.isActive && !i.isDeleted);
}

export function mergeSettingsTags(existing: string[], incoming: string[]): string[] {
  return normalizeSettingsTags([...existing, ...incoming]);
}

export function assertSettingsTransition(from: string, to: string): void {
  if (!canTransitionSettings(from, to)) {
    throw new Error(`Invalid settings transition from ${from} to ${to}`);
  }
}

export function groupSettingsByStatus(items: SettingsBase[]): Record<string, SettingsBase[]> {
  return items.reduce((acc, item) => {
    (acc[item.status] ||= []).push(item);
    return acc;
  }, {} as Record<string, SettingsBase[]>);
}

export function paginateSettings<T>(items: T[], page: number, limit: number): {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} {
  const total = items.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const start = (page - 1) * limit;
  return {
    items: items.slice(start, start + limit),
    total,
    page,
    limit,
    totalPages,
  };
}

export function computeSettingsScore(item: SettingsBase): number {
  let score = item.priority;
  if (item.isActive) score += 10;
  if ((item.amount || 0) > 1000) score += 5;
  if ((item.tags || []).includes('urgent')) score += 20;
  if (isTerminalSettingsStatus(item.status)) score -= 15;
  return score;
}
