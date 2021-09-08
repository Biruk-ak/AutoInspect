export type UserStatus =
  | 'draft'
  | 'pending'
  | 'active'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'archived'
  | 'failed';

export interface UserBase {
  id: string;
  status: UserStatus | string;
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

export interface CreateUserPayload {
  status?: UserStatus | string;
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

export interface UpdateUserPayload {
  status?: UserStatus | string;
  notes?: string;
  metadata?: Record<string, unknown>;
  priority?: number;
  tags?: string[];
  amount?: number;
  isActive?: boolean;
}

export interface UserFilters {
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

export interface UserStats {
  byStatus: Record<string, number>;
  total: number;
  active: number;
  averageAmount: number;
}

export function isTerminalUserStatus(status: string): boolean {
  return ['completed', 'cancelled', 'archived', 'failed'].includes(status);
}

export function canTransitionUser(from: string, to: string): boolean {
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

export function normalizeUserTags(tags: string[]): string[] {
  return Array.from(new Set(tags.map((t) => t.trim().toLowerCase()).filter(Boolean)));
}
