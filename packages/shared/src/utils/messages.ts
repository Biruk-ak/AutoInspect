import type { MessageBase, MessageFilters, MessageStats } from '../types/messages';
import { canTransitionMessage, isTerminalMessageStatus, normalizeMessageTags } from '../types/messages';

export function buildMessageQueryString(filters: MessageFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

export function summarizeMessageList(items: MessageBase[]): MessageStats {
  const byStatus: Record<string, number> = {};
  let amountSum = 0;
  let active = 0;
  for (const item of items) {
    byStatus[item.status] = (byStatus[item.status] || 0) + 1;
    amountSum += item.amount || 0;
    if (item.isActive && !isTerminalMessageStatus(item.status)) active += 1;
  }
  return {
    byStatus,
    total: items.length,
    active,
    averageAmount: items.length ? amountSum / items.length : 0,
  };
}

export function sortMessageByPriority(items: MessageBase[]): MessageBase[] {
  return [...items].sort((a, b) => b.priority - a.priority);
}

export function filterActiveMessage(items: MessageBase[]): MessageBase[] {
  return items.filter((i) => i.isActive && !i.isDeleted);
}

export function mergeMessageTags(existing: string[], incoming: string[]): string[] {
  return normalizeMessageTags([...existing, ...incoming]);
}

export function assertMessageTransition(from: string, to: string): void {
  if (!canTransitionMessage(from, to)) {
    throw new Error(`Invalid messages transition from ${from} to ${to}`);
  }
}

export function groupMessageByStatus(items: MessageBase[]): Record<string, MessageBase[]> {
  return items.reduce((acc, item) => {
    (acc[item.status] ||= []).push(item);
    return acc;
  }, {} as Record<string, MessageBase[]>);
}

export function paginateMessage<T>(items: T[], page: number, limit: number): {
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

export function computeMessageScore(item: MessageBase): number {
  let score = item.priority;
  if (item.isActive) score += 10;
  if ((item.amount || 0) > 1000) score += 5;
  if ((item.tags || []).includes('urgent')) score += 20;
  if (isTerminalMessageStatus(item.status)) score -= 15;
  return score;
}
