import type { ChecklistBase, ChecklistFilters, ChecklistStats } from '../types/checklists';
import { canTransitionChecklist, isTerminalChecklistStatus, normalizeChecklistTags } from '../types/checklists';

export function buildChecklistQueryString(filters: ChecklistFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

export function summarizeChecklistList(items: ChecklistBase[]): ChecklistStats {
  const byStatus: Record<string, number> = {};
  let amountSum = 0;
  let active = 0;
  for (const item of items) {
    byStatus[item.status] = (byStatus[item.status] || 0) + 1;
    amountSum += item.amount || 0;
    if (item.isActive && !isTerminalChecklistStatus(item.status)) active += 1;
  }
  return {
    byStatus,
    total: items.length,
    active,
    averageAmount: items.length ? amountSum / items.length : 0,
  };
}

export function sortChecklistByPriority(items: ChecklistBase[]): ChecklistBase[] {
  return [...items].sort((a, b) => b.priority - a.priority);
}

export function filterActiveChecklist(items: ChecklistBase[]): ChecklistBase[] {
  return items.filter((i) => i.isActive && !i.isDeleted);
}

export function mergeChecklistTags(existing: string[], incoming: string[]): string[] {
  return normalizeChecklistTags([...existing, ...incoming]);
}

export function assertChecklistTransition(from: string, to: string): void {
  if (!canTransitionChecklist(from, to)) {
    throw new Error(`Invalid checklists transition from ${from} to ${to}`);
  }
}

export function groupChecklistByStatus(items: ChecklistBase[]): Record<string, ChecklistBase[]> {
  return items.reduce((acc, item) => {
    (acc[item.status] ||= []).push(item);
    return acc;
  }, {} as Record<string, ChecklistBase[]>);
}

export function paginateChecklist<T>(items: T[], page: number, limit: number): {
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

export function computeChecklistScore(item: ChecklistBase): number {
  let score = item.priority;
  if (item.isActive) score += 10;
  if ((item.amount || 0) > 1000) score += 5;
  if ((item.tags || []).includes('urgent')) score += 20;
  if (isTerminalChecklistStatus(item.status)) score -= 15;
  return score;
}
