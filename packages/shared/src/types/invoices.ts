export type InvoiceStatus =
  | 'draft'
  | 'pending'
  | 'active'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'archived'
  | 'failed';

export interface InvoiceBase {
  id: string;
  status: InvoiceStatus | string;
  notes?: string;
  metadata: Record<string, unknown>;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  version: number;
  isActive: boolean;
  isDeleted: boolean;
  priority: number;
  tags: string[];
  locale?: string;
  currency?: string;
  amount?: number;
  quantity?: number;
  externalRef?: string;
}

export interface CreateInvoicePayload {
  status?: InvoiceStatus | string;
  notes?: string;
  metadata?: Record<string, unknown>;
  organizationId?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  currency?: string;
  relatedId?: string;
  ownerId?: string;
}

export interface UpdateInvoicePayload {
  status?: InvoiceStatus | string;
  notes?: string;
  metadata?: Record<string, unknown>;
  priority?: number;
  tags?: string[];
  amount?: number;
  isActive?: boolean;
}

export interface InvoiceFilters {
  organizationId?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  from?: string;
  to?: string;
}

export interface InvoiceStats {
  byStatus: Record<string, number>;
  total: number;
  active: number;
  averageAmount: number;
}

export function isTerminalInvoiceStatus(status: string): boolean {
  return ['completed', 'cancelled', 'archived', 'failed'].includes(status);
}

export function canTransitionInvoice(from: string, to: string): boolean {
  const transitions: Record<string, string[]> = {
    draft: ['pending', 'active', 'cancelled'],
    pending: ['active', 'cancelled'],
    active: ['in_progress', 'completed', 'cancelled'],
    in_progress: ['completed', 'failed', 'cancelled'],
    completed: ['archived'],
    cancelled: ['draft'],
    failed: ['draft', 'pending'],
    archived: [],
  };
  return (transitions[from] || []).includes(to);
}

export function normalizeInvoiceTags(tags: string[]): string[] {
  return Array.from(new Set(tags.map((t) => t.trim().toLowerCase()).filter(Boolean)));
}
