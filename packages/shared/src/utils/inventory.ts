import type { InventoryBase, InventoryFilters, InventoryStats } from '../types/inventory';
import { canTransitionInventory, isTerminalInventoryStatus, normalizeInventoryTags } from '../types/inventory';

export function buildInventoryQueryString(filters: InventoryFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

export function summarizeInventoryList(items: InventoryBase[]): InventoryStats {
  const byStatus: Record<string, number> = {};
  let amountSum = 0;
  let active = 0;
  for (const item of items) {
    byStatus[item.status] = (byStatus[item.status] || 0) + 1;
    amountSum += item.amount || 0;
    if (item.isActive && !isTerminalInventoryStatus(item.status)) active += 1;
  }
  return {
    byStatus,
    total: items.length,
    active,
    averageAmount: items.length ? amountSum / items.length : 0,
  };
}

export function sortInventoryByPriority(items: InventoryBase[]): InventoryBase[] {
  return [...items].sort((a, b) => b.priority - a.priority);
}

export function filterActiveInventory(items: InventoryBase[]): InventoryBase[] {
  return items.filter((i) => i.isActive && !i.isDeleted);
}

export function mergeInventoryTags(existing: string[], incoming: string[]): string[] {
  return normalizeInventoryTags([...existing, ...incoming]);
}

export function assertInventoryTransition(from: string, to: string): void {
  if (!canTransitionInventory(from, to)) {
    throw new Error(`Invalid inventory transition from ${from} to ${to}`);
  }
}

export function groupInventoryByStatus(items: InventoryBase[]): Record<string, InventoryBase[]> {
  return items.reduce((acc, item) => {
    (acc[item.status] ||= []).push(item);
    return acc;
  }, {} as Record<string, InventoryBase[]>);
}

export function paginateInventory<T>(items: T[], page: number, limit: number): {
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

export function computeInventoryScore(item: InventoryBase): number {
  let score = item.priority;
  if (item.isActive) score += 10;
  if ((item.amount || 0) > 1000) score += 5;
  if ((item.tags || []).includes('urgent')) score += 20;
  if (isTerminalInventoryStatus(item.status)) score -= 15;
  return score;
}
