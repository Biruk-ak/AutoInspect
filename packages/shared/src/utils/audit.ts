import type { AuditBase, AuditFilters, AuditStats } from '../types/audit';
import { canTransitionAudit, isTerminalAuditStatus, normalizeAuditTags } from '../types/audit';

export function buildAuditQueryString(filters: AuditFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

export function summarizeAuditList(items: AuditBase[]): AuditStats {
  const byStatus: Record<string, number> = {};
  let amountSum = 0;
  let active = 0;
  for (const item of items) {
    byStatus[item.status] = (byStatus[item.status] || 0) + 1;
    amountSum += item.amount || 0;
    if (item.isActive && !isTerminalAuditStatus(item.status)) active += 1;
  }
  return {
    byStatus,
    total: items.length,
    active,
    averageAmount: items.length ? amountSum / items.length : 0,
  };
}

export function sortAuditByPriority(items: AuditBase[]): AuditBase[] {
  return [...items].sort((a, b) => b.priority - a.priority);
}

export function filterActiveAudit(items: AuditBase[]): AuditBase[] {
  return items.filter((i) => i.isActive && !i.isDeleted);
}

export function mergeAuditTags(existing: string[], incoming: string[]): string[] {
  return normalizeAuditTags([...existing, ...incoming]);
}

export function assertAuditTransition(from: string, to: string): void {
  if (!canTransitionAudit(from, to)) {
    throw new Error(`Invalid audit transition from ${from} to ${to}`);
  }
}

export function groupAuditByStatus(items: AuditBase[]): Record<string, AuditBase[]> {
  return items.reduce((acc, item) => {
    (acc[item.status] ||= []).push(item);
    return acc;
  }, {} as Record<string, AuditBase[]>);
}

export function paginateAudit<T>(items: T[], page: number, limit: number): {
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

export function computeAuditScore(item: AuditBase): number {
  let score = item.priority;
  if (item.isActive) score += 10;
  if ((item.amount || 0) > 1000) score += 5;
  if ((item.tags || []).includes('urgent')) score += 20;
  if (isTerminalAuditStatus(item.status)) score -= 15;
  return score;
}
