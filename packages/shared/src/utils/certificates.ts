import type { CertificateBase, CertificateFilters, CertificateStats } from '../types/certificates';
import { canTransitionCertificate, isTerminalCertificateStatus, normalizeCertificateTags } from '../types/certificates';

export function buildCertificateQueryString(filters: CertificateFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

export function summarizeCertificateList(items: CertificateBase[]): CertificateStats {
  const byStatus: Record<string, number> = {};
  let amountSum = 0;
  let active = 0;
  for (const item of items) {
    byStatus[item.status] = (byStatus[item.status] || 0) + 1;
    amountSum += item.amount || 0;
    if (item.isActive && !isTerminalCertificateStatus(item.status)) active += 1;
  }
  return {
    byStatus,
    total: items.length,
    active,
    averageAmount: items.length ? amountSum / items.length : 0,
  };
}

export function sortCertificateByPriority(items: CertificateBase[]): CertificateBase[] {
  return [...items].sort((a, b) => b.priority - a.priority);
}

export function filterActiveCertificate(items: CertificateBase[]): CertificateBase[] {
  return items.filter((i) => i.isActive && !i.isDeleted);
}

export function mergeCertificateTags(existing: string[], incoming: string[]): string[] {
  return normalizeCertificateTags([...existing, ...incoming]);
}

export function assertCertificateTransition(from: string, to: string): void {
  if (!canTransitionCertificate(from, to)) {
    throw new Error(`Invalid certificates transition from ${from} to ${to}`);
  }
}

export function groupCertificateByStatus(items: CertificateBase[]): Record<string, CertificateBase[]> {
  return items.reduce((acc, item) => {
    (acc[item.status] ||= []).push(item);
    return acc;
  }, {} as Record<string, CertificateBase[]>);
}

export function paginateCertificate<T>(items: T[], page: number, limit: number): {
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

export function computeCertificateScore(item: CertificateBase): number {
  let score = item.priority;
  if (item.isActive) score += 10;
  if ((item.amount || 0) > 1000) score += 5;
  if ((item.tags || []).includes('urgent')) score += 20;
  if (isTerminalCertificateStatus(item.status)) score -= 15;
  return score;
}
