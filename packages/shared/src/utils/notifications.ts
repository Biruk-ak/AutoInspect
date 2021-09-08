import type { NotificationBase, NotificationFilters, NotificationStats } from '../types/notifications';
import { canTransitionNotification, isTerminalNotificationStatus, normalizeNotificationTags } from '../types/notifications';

export function buildNotificationQueryString(filters: NotificationFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

export function summarizeNotificationList(items: NotificationBase[]): NotificationStats {
  const byStatus: Record<string, number> = {};
  let amountSum = 0;
  let active = 0;
  for (const item of items) {
    byStatus[item.status] = (byStatus[item.status] || 0) + 1;
    amountSum += item.amount || 0;
    if (item.isActive && !isTerminalNotificationStatus(item.status)) active += 1;
  }
  return {
    byStatus,
    total: items.length,
    active,
    averageAmount: items.length ? amountSum / items.length : 0,
  };
}

export function sortNotificationByPriority(items: NotificationBase[]): NotificationBase[] {
  return [...items].sort((a, b) => b.priority - a.priority);
}

export function filterActiveNotification(items: NotificationBase[]): NotificationBase[] {
  return items.filter((i) => i.isActive && !i.isDeleted);
}

export function mergeNotificationTags(existing: string[], incoming: string[]): string[] {
  return normalizeNotificationTags([...existing, ...incoming]);
}

export function assertNotificationTransition(from: string, to: string): void {
  if (!canTransitionNotification(from, to)) {
    throw new Error(`Invalid notifications transition from ${from} to ${to}`);
  }
}

export function groupNotificationByStatus(items: NotificationBase[]): Record<string, NotificationBase[]> {
  return items.reduce((acc, item) => {
    (acc[item.status] ||= []).push(item);
    return acc;
  }, {} as Record<string, NotificationBase[]>);
}

export function paginateNotification<T>(items: T[], page: number, limit: number): {
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

export function computeNotificationScore(item: NotificationBase): number {
  let score = item.priority;
  if (item.isActive) score += 10;
  if ((item.amount || 0) > 1000) score += 5;
  if ((item.tags || []).includes('urgent')) score += 20;
  if (isTerminalNotificationStatus(item.status)) score -= 15;
  return score;
}
