import type { SchedulingBase, SchedulingFilters, SchedulingStats } from '../types/scheduling';
import { canTransitionScheduling, isTerminalSchedulingStatus, normalizeSchedulingTags } from '../types/scheduling';

export function buildSchedulingQueryString(filters: SchedulingFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

export function summarizeSchedulingList(items: SchedulingBase[]): SchedulingStats {
  const byStatus: Record<string, number> = {};
  let amountSum = 0;
  let active = 0;
  for (const item of items) {
    byStatus[item.status] = (byStatus[item.status] || 0) + 1;
    amountSum += item.amount || 0;
    if (item.isActive && !isTerminalSchedulingStatus(item.status)) active += 1;
  }
  return {
    byStatus,
    total: items.length,
    active,
    averageAmount: items.length ? amountSum / items.length : 0,
  };
}

export function sortSchedulingByPriority(items: SchedulingBase[]): SchedulingBase[] {
  return [...items].sort((a, b) => b.priority - a.priority);
}

export function filterActiveScheduling(items: SchedulingBase[]): SchedulingBase[] {
  return items.filter((i) => i.isActive && !i.isDeleted);
}

export function mergeSchedulingTags(existing: string[], incoming: string[]): string[] {
  return normalizeSchedulingTags([...existing, ...incoming]);
}

export function assertSchedulingTransition(from: string, to: string): void {
  if (!canTransitionScheduling(from, to)) {
    throw new Error(`Invalid scheduling transition from ${from} to ${to}`);
  }
}

export function groupSchedulingByStatus(items: SchedulingBase[]): Record<string, SchedulingBase[]> {
  return items.reduce((acc, item) => {
    (acc[item.status] ||= []).push(item);
    return acc;
  }, {} as Record<string, SchedulingBase[]>);
}

export function paginateScheduling<T>(items: T[], page: number, limit: number): {
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

export function computeSchedulingScore(item: SchedulingBase): number {
  let score = item.priority;
  if (item.isActive) score += 10;
  if ((item.amount || 0) > 1000) score += 5;
  if ((item.tags || []).includes('urgent')) score += 20;
  if (isTerminalSchedulingStatus(item.status)) score -= 15;
  return score;
}
