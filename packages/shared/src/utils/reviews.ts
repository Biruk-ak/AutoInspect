import type { ReviewBase, ReviewFilters, ReviewStats } from '../types/reviews';
import { canTransitionReview, isTerminalReviewStatus, normalizeReviewTags } from '../types/reviews';

export function buildReviewQueryString(filters: ReviewFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

export function summarizeReviewList(items: ReviewBase[]): ReviewStats {
  const byStatus: Record<string, number> = {};
  let amountSum = 0;
  let active = 0;
  for (const item of items) {
    byStatus[item.status] = (byStatus[item.status] || 0) + 1;
    amountSum += item.amount || 0;
    if (item.isActive && !isTerminalReviewStatus(item.status)) active += 1;
  }
  return {
    byStatus,
    total: items.length,
    active,
    averageAmount: items.length ? amountSum / items.length : 0,
  };
}

export function sortReviewByPriority(items: ReviewBase[]): ReviewBase[] {
  return [...items].sort((a, b) => b.priority - a.priority);
}

export function filterActiveReview(items: ReviewBase[]): ReviewBase[] {
  return items.filter((i) => i.isActive && !i.isDeleted);
}

export function mergeReviewTags(existing: string[], incoming: string[]): string[] {
  return normalizeReviewTags([...existing, ...incoming]);
}

export function assertReviewTransition(from: string, to: string): void {
  if (!canTransitionReview(from, to)) {
    throw new Error(`Invalid reviews transition from ${from} to ${to}`);
  }
}

export function groupReviewByStatus(items: ReviewBase[]): Record<string, ReviewBase[]> {
  return items.reduce((acc, item) => {
    (acc[item.status] ||= []).push(item);
    return acc;
  }, {} as Record<string, ReviewBase[]>);
}

export function paginateReview<T>(items: T[], page: number, limit: number): {
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

export function computeReviewScore(item: ReviewBase): number {
  let score = item.priority;
  if (item.isActive) score += 10;
  if ((item.amount || 0) > 1000) score += 5;
  if ((item.tags || []).includes('urgent')) score += 20;
  if (isTerminalReviewStatus(item.status)) score -= 15;
  return score;
}
