import type { PhotoBase, PhotoFilters, PhotoStats } from '../types/photos';
import { canTransitionPhoto, isTerminalPhotoStatus, normalizePhotoTags } from '../types/photos';

export function buildPhotoQueryString(filters: PhotoFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

export function summarizePhotoList(items: PhotoBase[]): PhotoStats {
  const byStatus: Record<string, number> = {};
  let amountSum = 0;
  let active = 0;
  for (const item of items) {
    byStatus[item.status] = (byStatus[item.status] || 0) + 1;
    amountSum += item.amount || 0;
    if (item.isActive && !isTerminalPhotoStatus(item.status)) active += 1;
  }
  return {
    byStatus,
    total: items.length,
    active,
    averageAmount: items.length ? amountSum / items.length : 0,
  };
}

export function sortPhotoByPriority(items: PhotoBase[]): PhotoBase[] {
  return [...items].sort((a, b) => b.priority - a.priority);
}

export function filterActivePhoto(items: PhotoBase[]): PhotoBase[] {
  return items.filter((i) => i.isActive && !i.isDeleted);
}

export function mergePhotoTags(existing: string[], incoming: string[]): string[] {
  return normalizePhotoTags([...existing, ...incoming]);
}

export function assertPhotoTransition(from: string, to: string): void {
  if (!canTransitionPhoto(from, to)) {
    throw new Error(`Invalid photos transition from ${from} to ${to}`);
  }
}

export function groupPhotoByStatus(items: PhotoBase[]): Record<string, PhotoBase[]> {
  return items.reduce((acc, item) => {
    (acc[item.status] ||= []).push(item);
    return acc;
  }, {} as Record<string, PhotoBase[]>);
}

export function paginatePhoto<T>(items: T[], page: number, limit: number): {
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

export function computePhotoScore(item: PhotoBase): number {
  let score = item.priority;
  if (item.isActive) score += 10;
  if ((item.amount || 0) > 1000) score += 5;
  if ((item.tags || []).includes('urgent')) score += 20;
  if (isTerminalPhotoStatus(item.status)) score -= 15;
  return score;
}
