import type { InsuranceBase, InsuranceFilters, InsuranceStats } from '../types/insurance';
import { canTransitionInsurance, isTerminalInsuranceStatus, normalizeInsuranceTags } from '../types/insurance';

export function buildInsuranceQueryString(filters: InsuranceFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

export function summarizeInsuranceList(items: InsuranceBase[]): InsuranceStats {
  const byStatus: Record<string, number> = {};
  let amountSum = 0;
  let active = 0;
  for (const item of items) {
    byStatus[item.status] = (byStatus[item.status] || 0) + 1;
    amountSum += item.amount || 0;
    if (item.isActive && !isTerminalInsuranceStatus(item.status)) active += 1;
  }
  return {
    byStatus,
    total: items.length,
    active,
    averageAmount: items.length ? amountSum / items.length : 0,
  };
}

export function sortInsuranceByPriority(items: InsuranceBase[]): InsuranceBase[] {
  return [...items].sort((a, b) => b.priority - a.priority);
}

export function filterActiveInsurance(items: InsuranceBase[]): InsuranceBase[] {
  return items.filter((i) => i.isActive && !i.isDeleted);
}

export function mergeInsuranceTags(existing: string[], incoming: string[]): string[] {
  return normalizeInsuranceTags([...existing, ...incoming]);
}

export function assertInsuranceTransition(from: string, to: string): void {
  if (!canTransitionInsurance(from, to)) {
    throw new Error(`Invalid insurance transition from ${from} to ${to}`);
  }
}

export function groupInsuranceByStatus(items: InsuranceBase[]): Record<string, InsuranceBase[]> {
  return items.reduce((acc, item) => {
    (acc[item.status] ||= []).push(item);
    return acc;
  }, {} as Record<string, InsuranceBase[]>);
}

export function paginateInsurance<T>(items: T[], page: number, limit: number): {
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

export function computeInsuranceScore(item: InsuranceBase): number {
  let score = item.priority;
  if (item.isActive) score += 10;
  if ((item.amount || 0) > 1000) score += 5;
  if ((item.tags || []).includes('urgent')) score += 20;
  if (isTerminalInsuranceStatus(item.status)) score -= 15;
  return score;
}
