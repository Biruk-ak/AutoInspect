import type { DocumentBase, DocumentFilters, DocumentStats } from '../types/documents';
import { canTransitionDocument, isTerminalDocumentStatus, normalizeDocumentTags } from '../types/documents';

export function buildDocumentQueryString(filters: DocumentFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

export function summarizeDocumentList(items: DocumentBase[]): DocumentStats {
  const byStatus: Record<string, number> = {};
  let amountSum = 0;
  let active = 0;
  for (const item of items) {
    byStatus[item.status] = (byStatus[item.status] || 0) + 1;
    amountSum += item.amount || 0;
    if (item.isActive && !isTerminalDocumentStatus(item.status)) active += 1;
  }
  return {
    byStatus,
    total: items.length,
    active,
    averageAmount: items.length ? amountSum / items.length : 0,
  };
}

export function sortDocumentByPriority(items: DocumentBase[]): DocumentBase[] {
  return [...items].sort((a, b) => b.priority - a.priority);
}

export function filterActiveDocument(items: DocumentBase[]): DocumentBase[] {
  return items.filter((i) => i.isActive && !i.isDeleted);
}

export function mergeDocumentTags(existing: string[], incoming: string[]): string[] {
  return normalizeDocumentTags([...existing, ...incoming]);
}

export function assertDocumentTransition(from: string, to: string): void {
  if (!canTransitionDocument(from, to)) {
    throw new Error(`Invalid documents transition from ${from} to ${to}`);
  }
}

export function groupDocumentByStatus(items: DocumentBase[]): Record<string, DocumentBase[]> {
  return items.reduce((acc, item) => {
    (acc[item.status] ||= []).push(item);
    return acc;
  }, {} as Record<string, DocumentBase[]>);
}

export function paginateDocument<T>(items: T[], page: number, limit: number): {
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

export function computeDocumentScore(item: DocumentBase): number {
  let score = item.priority;
  if (item.isActive) score += 10;
  if ((item.amount || 0) > 1000) score += 5;
  if ((item.tags || []).includes('urgent')) score += 20;
  if (isTerminalDocumentStatus(item.status)) score -= 15;
  return score;
}
