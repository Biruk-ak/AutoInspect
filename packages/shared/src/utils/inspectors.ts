import type { InspectorBase, InspectorFilters, InspectorStats } from '../types/inspectors';
import { canTransitionInspector, isTerminalInspectorStatus, normalizeInspectorTags } from '../types/inspectors';

export function buildInspectorQueryString(filters: InspectorFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

export function summarizeInspectorList(items: InspectorBase[]): InspectorStats {
  const byStatus: Record<string, number> = {};
  let amountSum = 0;
  let active = 0;
  for (const item of items) {
    byStatus[item.status] = (byStatus[item.status] || 0) + 1;
    amountSum += item.amount || 0;
    if (item.isActive && !isTerminalInspectorStatus(item.status)) active += 1;
  }
  return {
    byStatus,
    total: items.length,
    active,
    averageAmount: items.length ? amountSum / items.length : 0,
  };
}

export function sortInspectorByPriority(items: InspectorBase[]): InspectorBase[] {
  return [...items].sort((a, b) => b.priority - a.priority);
}

export function filterActiveInspector(items: InspectorBase[]): InspectorBase[] {
  return items.filter((i) => i.isActive && !i.isDeleted);
}

export function mergeInspectorTags(existing: string[], incoming: string[]): string[] {
  return normalizeInspectorTags([...existing, ...incoming]);
}

export function assertInspectorTransition(from: string, to: string): void {
  if (!canTransitionInspector(from, to)) {
    throw new Error(`Invalid inspectors transition from ${from} to ${to}`);
  }
}

export function groupInspectorByStatus(items: InspectorBase[]): Record<string, InspectorBase[]> {
  return items.reduce((acc, item) => {
    (acc[item.status] ||= []).push(item);
    return acc;
  }, {} as Record<string, InspectorBase[]>);
}

export function paginateInspector<T>(items: T[], page: number, limit: number): {
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

export function computeInspectorScore(item: InspectorBase): number {
  let score = item.priority;
  if (item.isActive) score += 10;
  if ((item.amount || 0) > 1000) score += 5;
  if ((item.tags || []).includes('urgent')) score += 20;
  if (isTerminalInspectorStatus(item.status)) score -= 15;
  return score;
}
