import type { CustomerBase, CustomerFilters, CustomerStats } from '../types/customers';
import { canTransitionCustomer, isTerminalCustomerStatus, normalizeCustomerTags } from '../types/customers';

export function buildCustomerQueryString(filters: CustomerFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

export function summarizeCustomerList(items: CustomerBase[]): CustomerStats {
  const byStatus: Record<string, number> = {};
  let amountSum = 0;
  let active = 0;
  for (const item of items) {
    byStatus[item.status] = (byStatus[item.status] || 0) + 1;
    amountSum += item.amount || 0;
    if (item.isActive && !isTerminalCustomerStatus(item.status)) active += 1;
  }
  return {
    byStatus,
    total: items.length,
    active,
    averageAmount: items.length ? amountSum / items.length : 0,
  };
}

export function sortCustomerByPriority(items: CustomerBase[]): CustomerBase[] {
  return [...items].sort((a, b) => b.priority - a.priority);
}

export function filterActiveCustomer(items: CustomerBase[]): CustomerBase[] {
  return items.filter((i) => i.isActive && !i.isDeleted);
}

export function mergeCustomerTags(existing: string[], incoming: string[]): string[] {
  return normalizeCustomerTags([...existing, ...incoming]);
}

export function assertCustomerTransition(from: string, to: string): void {
  if (!canTransitionCustomer(from, to)) {
    throw new Error(`Invalid customers transition from ${from} to ${to}`);
  }
}

export function groupCustomerByStatus(items: CustomerBase[]): Record<string, CustomerBase[]> {
  return items.reduce((acc, item) => {
    (acc[item.status] ||= []).push(item);
    return acc;
  }, {} as Record<string, CustomerBase[]>);
}

export function paginateCustomer<T>(items: T[], page: number, limit: number): {
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

export function computeCustomerScore(item: CustomerBase): number {
  let score = item.priority;
  if (item.isActive) score += 10;
  if ((item.amount || 0) > 1000) score += 5;
  if ((item.tags || []).includes('urgent')) score += 20;
  if (isTerminalCustomerStatus(item.status)) score -= 15;
  return score;
}
