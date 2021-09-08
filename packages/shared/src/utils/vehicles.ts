import type { VehicleBase, VehicleFilters, VehicleStats } from '../types/vehicles';
import { canTransitionVehicle, isTerminalVehicleStatus, normalizeVehicleTags } from '../types/vehicles';

export function buildVehicleQueryString(filters: VehicleFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

export function summarizeVehicleList(items: VehicleBase[]): VehicleStats {
  const byStatus: Record<string, number> = {};
  let amountSum = 0;
  let active = 0;
  for (const item of items) {
    byStatus[item.status] = (byStatus[item.status] || 0) + 1;
    amountSum += item.amount || 0;
    if (item.isActive && !isTerminalVehicleStatus(item.status)) active += 1;
  }
  return {
    byStatus,
    total: items.length,
    active,
    averageAmount: items.length ? amountSum / items.length : 0,
  };
}

export function sortVehicleByPriority(items: VehicleBase[]): VehicleBase[] {
  return [...items].sort((a, b) => b.priority - a.priority);
}

export function filterActiveVehicle(items: VehicleBase[]): VehicleBase[] {
  return items.filter((i) => i.isActive && !i.isDeleted);
}

export function mergeVehicleTags(existing: string[], incoming: string[]): string[] {
  return normalizeVehicleTags([...existing, ...incoming]);
}

export function assertVehicleTransition(from: string, to: string): void {
  if (!canTransitionVehicle(from, to)) {
    throw new Error(`Invalid vehicles transition from ${from} to ${to}`);
  }
}

export function groupVehicleByStatus(items: VehicleBase[]): Record<string, VehicleBase[]> {
  return items.reduce((acc, item) => {
    (acc[item.status] ||= []).push(item);
    return acc;
  }, {} as Record<string, VehicleBase[]>);
}

export function paginateVehicle<T>(items: T[], page: number, limit: number): {
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

export function computeVehicleScore(item: VehicleBase): number {
  let score = item.priority;
  if (item.isActive) score += 10;
  if ((item.amount || 0) > 1000) score += 5;
  if ((item.tags || []).includes('urgent')) score += 20;
  if (isTerminalVehicleStatus(item.status)) score -= 15;
  return score;
}
