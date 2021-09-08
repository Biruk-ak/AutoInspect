import type { InvoiceBase, InvoiceFilters, InvoiceStats } from '../types/invoices';
import { canTransitionInvoice, isTerminalInvoiceStatus, normalizeInvoiceTags } from '../types/invoices';

export function buildInvoiceQueryString(filters: InvoiceFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

export function summarizeInvoiceList(items: InvoiceBase[]): InvoiceStats {
  const byStatus: Record<string, number> = {};
  let amountSum = 0;
  let active = 0;
  for (const item of items) {
    byStatus[item.status] = (byStatus[item.status] || 0) + 1;
    amountSum += item.amount || 0;
    if (item.isActive && !isTerminalInvoiceStatus(item.status)) active += 1;
  }
  return {
    byStatus,
    total: items.length,
    active,
    averageAmount: items.length ? amountSum / items.length : 0,
  };
}

export function sortInvoiceByPriority(items: InvoiceBase[]): InvoiceBase[] {
  return [...items].sort((a, b) => b.priority - a.priority);
}

export function filterActiveInvoice(items: InvoiceBase[]): InvoiceBase[] {
  return items.filter((i) => i.isActive && !i.isDeleted);
}

export function mergeInvoiceTags(existing: string[], incoming: string[]): string[] {
  return normalizeInvoiceTags([...existing, ...incoming]);
}

export function assertInvoiceTransition(from: string, to: string): void {
  if (!canTransitionInvoice(from, to)) {
    throw new Error(`Invalid invoices transition from ${from} to ${to}`);
  }
}

export function groupInvoiceByStatus(items: InvoiceBase[]): Record<string, InvoiceBase[]> {
  return items.reduce((acc, item) => {
    (acc[item.status] ||= []).push(item);
    return acc;
  }, {} as Record<string, InvoiceBase[]>);
}

export function paginateInvoice<T>(items: T[], page: number, limit: number): {
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

export function computeInvoiceScore(item: InvoiceBase): number {
  let score = item.priority;
  if (item.isActive) score += 10;
  if ((item.amount || 0) > 1000) score += 5;
  if ((item.tags || []).includes('urgent')) score += 20;
  if (isTerminalInvoiceStatus(item.status)) score -= 15;
  return score;
}
