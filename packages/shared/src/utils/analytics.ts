import type { AnalyticsBase, AnalyticsFilters, AnalyticsStats } from '../types/analytics';
import { canTransitionAnalytics, isTerminalAnalyticsStatus, normalizeAnalyticsTags } from '../types/analytics';

export function buildAnalyticsQueryString(filters: AnalyticsFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

export function summarizeAnalyticsList(items: AnalyticsBase[]): AnalyticsStats {
  const byStatus: Record<string, number> = {};
  let amountSum = 0;
  let active = 0;
  for (const item of items) {
    byStatus[item.status] = (byStatus[item.status] || 0) + 1;
    amountSum += item.amount || 0;
    if (item.isActive && !isTerminalAnalyticsStatus(item.status)) active += 1;
  }
  return {
    byStatus,
    total: items.length,
    active,
    averageAmount: items.length ? amountSum / items.length : 0,
  };
}

export function sortAnalyticsByPriority(items: AnalyticsBase[]): AnalyticsBase[] {
  return [...items].sort((a, b) => b.priority - a.priority);
}

export function filterActiveAnalytics(items: AnalyticsBase[]): AnalyticsBase[] {
  return items.filter((i) => i.isActive && !i.isDeleted);
}

export function mergeAnalyticsTags(existing: string[], incoming: string[]): string[] {
  return normalizeAnalyticsTags([...existing, ...incoming]);
}

export function assertAnalyticsTransition(from: string, to: string): void {
  if (!canTransitionAnalytics(from, to)) {
    throw new Error(`Invalid analytics transition from ${from} to ${to}`);
  }
}

export function groupAnalyticsByStatus(items: AnalyticsBase[]): Record<string, AnalyticsBase[]> {
  return items.reduce((acc, item) => {
    (acc[item.status] ||= []).push(item);
    return acc;
  }, {} as Record<string, AnalyticsBase[]>);
}

export function paginateAnalytics<T>(items: T[], page: number, limit: number): {
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

export function computeAnalyticsScore(item: AnalyticsBase): number {
  let score = item.priority;
  if (item.isActive) score += 10;
  if ((item.amount || 0) > 1000) score += 5;
  if ((item.tags || []).includes('urgent')) score += 20;
  if (isTerminalAnalyticsStatus(item.status)) score -= 15;
  return score;
}
