import type { UserBase, UserFilters, UserStats } from '../types/users';
import { canTransitionUser, isTerminalUserStatus, normalizeUserTags } from '../types/users';

export function buildUserQueryString(filters: UserFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

export function summarizeUserList(items: UserBase[]): UserStats {
  const byStatus: Record<string, number> = {};
  let amountSum = 0;
  let active = 0;
  for (const item of items) {
    byStatus[item.status] = (byStatus[item.status] || 0) + 1;
    amountSum += item.amount || 0;
    if (item.isActive && !isTerminalUserStatus(item.status)) active += 1;
  }
  return {
    byStatus,
    total: items.length,
    active,
    averageAmount: items.length ? amountSum / items.length : 0,
  };
}

export function sortUserByPriority(items: UserBase[]): UserBase[] {
  return [...items].sort((a, b) => b.priority - a.priority);
}

export function filterActiveUser(items: UserBase[]): UserBase[] {
  return items.filter((i) => i.isActive && !i.isDeleted);
}

export function mergeUserTags(existing: string[], incoming: string[]): string[] {
  return normalizeUserTags([...existing, ...incoming]);
}

export function assertUserTransition(from: string, to: string): void {
  if (!canTransitionUser(from, to)) {
    throw new Error(`Invalid users transition from ${from} to ${to}`);
  }
}

export function groupUserByStatus(items: UserBase[]): Record<string, UserBase[]> {
  return items.reduce((acc, item) => {
    (acc[item.status] ||= []).push(item);
    return acc;
  }, {} as Record<string, UserBase[]>);
}

export function paginateUser<T>(items: T[], page: number, limit: number): {
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

export function computeUserScore(item: UserBase): number {
  let score = item.priority;
  if (item.isActive) score += 10;
  if ((item.amount || 0) > 1000) score += 5;
  if ((item.tags || []).includes('urgent')) score += 20;
  if (isTerminalUserStatus(item.status)) score -= 15;
  return score;
}
