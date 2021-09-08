import type { ComplianceBase, ComplianceFilters, ComplianceStats } from '../types/compliance';
import { canTransitionCompliance, isTerminalComplianceStatus, normalizeComplianceTags } from '../types/compliance';

export function buildComplianceQueryString(filters: ComplianceFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

export function summarizeComplianceList(items: ComplianceBase[]): ComplianceStats {
  const byStatus: Record<string, number> = {};
  let amountSum = 0;
  let active = 0;
  for (const item of items) {
    byStatus[item.status] = (byStatus[item.status] || 0) + 1;
    amountSum += item.amount || 0;
    if (item.isActive && !isTerminalComplianceStatus(item.status)) active += 1;
  }
  return {
    byStatus,
    total: items.length,
    active,
    averageAmount: items.length ? amountSum / items.length : 0,
  };
}

export function sortComplianceByPriority(items: ComplianceBase[]): ComplianceBase[] {
  return [...items].sort((a, b) => b.priority - a.priority);
}

export function filterActiveCompliance(items: ComplianceBase[]): ComplianceBase[] {
  return items.filter((i) => i.isActive && !i.isDeleted);
}

export function mergeComplianceTags(existing: string[], incoming: string[]): string[] {
  return normalizeComplianceTags([...existing, ...incoming]);
}

export function assertComplianceTransition(from: string, to: string): void {
  if (!canTransitionCompliance(from, to)) {
    throw new Error(`Invalid compliance transition from ${from} to ${to}`);
  }
}

export function groupComplianceByStatus(items: ComplianceBase[]): Record<string, ComplianceBase[]> {
  return items.reduce((acc, item) => {
    (acc[item.status] ||= []).push(item);
    return acc;
  }, {} as Record<string, ComplianceBase[]>);
}

export function paginateCompliance<T>(items: T[], page: number, limit: number): {
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

export function computeComplianceScore(item: ComplianceBase): number {
  let score = item.priority;
  if (item.isActive) score += 10;
  if ((item.amount || 0) > 1000) score += 5;
  if ((item.tags || []).includes('urgent')) score += 20;
  if (isTerminalComplianceStatus(item.status)) score -= 15;
  return score;
}
