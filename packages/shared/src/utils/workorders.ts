import type { WorkOrderBase, WorkOrderFilters, WorkOrderStats } from '../types/workorders';
import { canTransitionWorkOrder, isTerminalWorkOrderStatus, normalizeWorkOrderTags } from '../types/workorders';

export function buildWorkOrderQueryString(filters: WorkOrderFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

export function summarizeWorkOrderList(items: WorkOrderBase[]): WorkOrderStats {
  const byStatus: Record<string, number> = {};
  let amountSum = 0;
  let active = 0;
  for (const item of items) {
    byStatus[item.status] = (byStatus[item.status] || 0) + 1;
    amountSum += item.amount || 0;
    if (item.isActive && !isTerminalWorkOrderStatus(item.status)) active += 1;
  }
  return {
    byStatus,
    total: items.length,
    active,
    averageAmount: items.length ? amountSum / items.length : 0,
  };
}

export function sortWorkOrderByPriority(items: WorkOrderBase[]): WorkOrderBase[] {
  return [...items].sort((a, b) => b.priority - a.priority);
}

export function filterActiveWorkOrder(items: WorkOrderBase[]): WorkOrderBase[] {
  return items.filter((i) => i.isActive && !i.isDeleted);
}

export function mergeWorkOrderTags(existing: string[], incoming: string[]): string[] {
  return normalizeWorkOrderTags([...existing, ...incoming]);
}

export function assertWorkOrderTransition(from: string, to: string): void {
  if (!canTransitionWorkOrder(from, to)) {
    throw new Error(`Invalid workorders transition from ${from} to ${to}`);
  }
}

export function groupWorkOrderByStatus(items: WorkOrderBase[]): Record<string, WorkOrderBase[]> {
  return items.reduce((acc, item) => {
    (acc[item.status] ||= []).push(item);
    return acc;
  }, {} as Record<string, WorkOrderBase[]>);
}

export function paginateWorkOrder<T>(items: T[], page: number, limit: number): {
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

export function computeWorkOrderScore(item: WorkOrderBase): number {
  let score = item.priority;
  if (item.isActive) score += 10;
  if ((item.amount || 0) > 1000) score += 5;
  if ((item.tags || []).includes('urgent')) score += 20;
  if (isTerminalWorkOrderStatus(item.status)) score -= 15;
  return score;
}
