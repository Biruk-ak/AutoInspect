import type { ReportBase, ReportFilters, ReportStats } from '../types/reports';
import { canTransitionReport, isTerminalReportStatus, normalizeReportTags } from '../types/reports';

export function buildReportQueryString(filters: ReportFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

export function summarizeReportList(items: ReportBase[]): ReportStats {
  const byStatus: Record<string, number> = {};
  let amountSum = 0;
  let active = 0;
  for (const item of items) {
    byStatus[item.status] = (byStatus[item.status] || 0) + 1;
    amountSum += item.amount || 0;
    if (item.isActive && !isTerminalReportStatus(item.status)) active += 1;
  }
  return {
    byStatus,
    total: items.length,
    active,
    averageAmount: items.length ? amountSum / items.length : 0,
  };
}

export function sortReportByPriority(items: ReportBase[]): ReportBase[] {
  return [...items].sort((a, b) => b.priority - a.priority);
}

export function filterActiveReport(items: ReportBase[]): ReportBase[] {
  return items.filter((i) => i.isActive && !i.isDeleted);
}

export function mergeReportTags(existing: string[], incoming: string[]): string[] {
  return normalizeReportTags([...existing, ...incoming]);
}

export function assertReportTransition(from: string, to: string): void {
  if (!canTransitionReport(from, to)) {
    throw new Error(`Invalid reports transition from ${from} to ${to}`);
  }
}

export function groupReportByStatus(items: ReportBase[]): Record<string, ReportBase[]> {
  return items.reduce((acc, item) => {
    (acc[item.status] ||= []).push(item);
    return acc;
  }, {} as Record<string, ReportBase[]>);
}

export function paginateReport<T>(items: T[], page: number, limit: number): {
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

export function computeReportScore(item: ReportBase): number {
  let score = item.priority;
  if (item.isActive) score += 10;
  if ((item.amount || 0) > 1000) score += 5;
  if ((item.tags || []).includes('urgent')) score += 20;
  if (isTerminalReportStatus(item.status)) score -= 15;
  return score;
}
