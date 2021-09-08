import type { GarageBase, GarageFilters, GarageStats } from '../types/garages';
import { canTransitionGarage, isTerminalGarageStatus, normalizeGarageTags } from '../types/garages';

export function buildGarageQueryString(filters: GarageFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

export function summarizeGarageList(items: GarageBase[]): GarageStats {
  const byStatus: Record<string, number> = {};
  let amountSum = 0;
  let active = 0;
  for (const item of items) {
    byStatus[item.status] = (byStatus[item.status] || 0) + 1;
    amountSum += item.amount || 0;
    if (item.isActive && !isTerminalGarageStatus(item.status)) active += 1;
  }
  return {
    byStatus,
    total: items.length,
    active,
    averageAmount: items.length ? amountSum / items.length : 0,
  };
}

export function sortGarageByPriority(items: GarageBase[]): GarageBase[] {
  return [...items].sort((a, b) => b.priority - a.priority);
}

export function filterActiveGarage(items: GarageBase[]): GarageBase[] {
  return items.filter((i) => i.isActive && !i.isDeleted);
}

export function mergeGarageTags(existing: string[], incoming: string[]): string[] {
  return normalizeGarageTags([...existing, ...incoming]);
}

export function assertGarageTransition(from: string, to: string): void {
  if (!canTransitionGarage(from, to)) {
    throw new Error(`Invalid garages transition from ${from} to ${to}`);
  }
}

export function groupGarageByStatus(items: GarageBase[]): Record<string, GarageBase[]> {
  return items.reduce((acc, item) => {
    (acc[item.status] ||= []).push(item);
    return acc;
  }, {} as Record<string, GarageBase[]>);
}

export function paginateGarage<T>(items: T[], page: number, limit: number): {
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

export function computeGarageScore(item: GarageBase): number {
  let score = item.priority;
  if (item.isActive) score += 10;
  if ((item.amount || 0) > 1000) score += 5;
  if ((item.tags || []).includes('urgent')) score += 20;
  if (isTerminalGarageStatus(item.status)) score -= 15;
  return score;
}
