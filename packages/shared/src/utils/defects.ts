import type { DefectBase, DefectFilters, DefectStats } from '../types/defects';
import { canTransitionDefect, isTerminalDefectStatus, normalizeDefectTags } from '../types/defects';

export function buildDefectQueryString(filters: DefectFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

export function summarizeDefectList(items: DefectBase[]): DefectStats {
  const byStatus: Record<string, number> = {};
  let amountSum = 0;
  let active = 0;
  for (const item of items) {
    byStatus[item.status] = (byStatus[item.status] || 0) + 1;
    amountSum += item.amount || 0;
    if (item.isActive && !isTerminalDefectStatus(item.status)) active += 1;
  }
  return {
    byStatus,
    total: items.length,
    active,
    averageAmount: items.length ? amountSum / items.length : 0,
  };
}

export function sortDefectByPriority(items: DefectBase[]): DefectBase[] {
  return [...items].sort((a, b) => b.priority - a.priority);
}

export function filterActiveDefect(items: DefectBase[]): DefectBase[] {
  return items.filter((i) => i.isActive && !i.isDeleted);
}

export function mergeDefectTags(existing: string[], incoming: string[]): string[] {
  return normalizeDefectTags([...existing, ...incoming]);
}

export function assertDefectTransition(from: string, to: string): void {
  if (!canTransitionDefect(from, to)) {
    throw new Error(`Invalid defects transition from ${from} to ${to}`);
  }
}

export function groupDefectByStatus(items: DefectBase[]): Record<string, DefectBase[]> {
  return items.reduce((acc, item) => {
    (acc[item.status] ||= []).push(item);
    return acc;
  }, {} as Record<string, DefectBase[]>);
}

export function paginateDefect<T>(items: T[], page: number, limit: number): {
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

export function computeDefectScore(item: DefectBase): number {
  let score = item.priority;
  if (item.isActive) score += 10;
  if ((item.amount || 0) > 1000) score += 5;
  if ((item.tags || []).includes('urgent')) score += 20;
  if (isTerminalDefectStatus(item.status)) score -= 15;
  return score;
}
