import type { PaymentBase, PaymentFilters, PaymentStats } from '../types/payments';
import { canTransitionPayment, isTerminalPaymentStatus, normalizePaymentTags } from '../types/payments';

export function buildPaymentQueryString(filters: PaymentFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

export function summarizePaymentList(items: PaymentBase[]): PaymentStats {
  const byStatus: Record<string, number> = {};
  let amountSum = 0;
  let active = 0;
  for (const item of items) {
    byStatus[item.status] = (byStatus[item.status] || 0) + 1;
    amountSum += item.amount || 0;
    if (item.isActive && !isTerminalPaymentStatus(item.status)) active += 1;
  }
  return {
    byStatus,
    total: items.length,
    active,
    averageAmount: items.length ? amountSum / items.length : 0,
  };
}

export function sortPaymentByPriority(items: PaymentBase[]): PaymentBase[] {
  return [...items].sort((a, b) => b.priority - a.priority);
}

export function filterActivePayment(items: PaymentBase[]): PaymentBase[] {
  return items.filter((i) => i.isActive && !i.isDeleted);
}

export function mergePaymentTags(existing: string[], incoming: string[]): string[] {
  return normalizePaymentTags([...existing, ...incoming]);
}

export function assertPaymentTransition(from: string, to: string): void {
  if (!canTransitionPayment(from, to)) {
    throw new Error(`Invalid payments transition from ${from} to ${to}`);
  }
}

export function groupPaymentByStatus(items: PaymentBase[]): Record<string, PaymentBase[]> {
  return items.reduce((acc, item) => {
    (acc[item.status] ||= []).push(item);
    return acc;
  }, {} as Record<string, PaymentBase[]>);
}

export function paginatePayment<T>(items: T[], page: number, limit: number): {
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

export function computePaymentScore(item: PaymentBase): number {
  let score = item.priority;
  if (item.isActive) score += 10;
  if ((item.amount || 0) > 1000) score += 5;
  if ((item.tags || []).includes('urgent')) score += 20;
  if (isTerminalPaymentStatus(item.status)) score -= 15;
  return score;
}
