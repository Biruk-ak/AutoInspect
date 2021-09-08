import type { InspectionBase, InspectionFilters, InspectionStats } from '../types/inspections';
import { canTransitionInspection, isTerminalInspectionStatus, normalizeInspectionTags } from '../types/inspections';

export function buildInspectionQueryString(filters: InspectionFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

export function summarizeInspectionList(items: InspectionBase[]): InspectionStats {
  const byStatus: Record<string, number> = {};
  let amountSum = 0;
  let active = 0;
  for (const item of items) {
    byStatus[item.status] = (byStatus[item.status] || 0) + 1;
    amountSum += item.amount || 0;
    if (item.isActive && !isTerminalInspectionStatus(item.status)) active += 1;
  }
  return {
    byStatus,
    total: items.length,
    active,
    averageAmount: items.length ? amountSum / items.length : 0,
  };
}

export function sortInspectionByPriority(items: InspectionBase[]): InspectionBase[] {
  return [...items].sort((a, b) => b.priority - a.priority);
}

export function filterActiveInspection(items: InspectionBase[]): InspectionBase[] {
  return items.filter((i) => i.isActive && !i.isDeleted);
}

export function mergeInspectionTags(existing: string[], incoming: string[]): string[] {
  return normalizeInspectionTags([...existing, ...incoming]);
}

export function assertInspectionTransition(from: string, to: string): void {
  if (!canTransitionInspection(from, to)) {
    throw new Error(`Invalid inspections transition from ${from} to ${to}`);
  }
}

export function groupInspectionByStatus(items: InspectionBase[]): Record<string, InspectionBase[]> {
  return items.reduce((acc, item) => {
    (acc[item.status] ||= []).push(item);
    return acc;
  }, {} as Record<string, InspectionBase[]>);
}

export function paginateInspection<T>(items: T[], page: number, limit: number): {
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

export function computeInspectionScore(item: InspectionBase): number {
  let score = item.priority;
  if (item.isActive) score += 10;
  if ((item.amount || 0) > 1000) score += 5;
  if ((item.tags || []).includes('urgent')) score += 20;
  if (isTerminalInspectionStatus(item.status)) score -= 15;
  return score;
}
