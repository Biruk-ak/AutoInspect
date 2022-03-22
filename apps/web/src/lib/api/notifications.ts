import { apiRequest } from './client';

export interface NotificationRecord {
  id: string;
  status: string;
  notes?: string;
  metadata: Record<string, unknown>;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  priority: number;
  tags: string[];
  amount?: number;
  currency?: string;
  externalRef?: string;
}

export interface ListResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface NotificationQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  organizationId?: string;
  vehicleId?: string;
  from?: string;
  to?: string;
}

export interface CreateNotificationInput {
  status?: string;
  notes?: string;
  organizationId?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateNotificationInput {
  status?: string;
  notes?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  metadata?: Record<string, unknown>;
}

export async function fetchNotificationList(
  token: string,
  query: NotificationQuery = {},
): Promise<ListResponse<NotificationRecord>> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<ListResponse<NotificationRecord>>(`/notifications?${params}`, { token });
}

export async function fetchNotificationById(token: string, id: string): Promise<NotificationRecord> {
  return apiRequest<NotificationRecord>(`/notifications/${id}`, { token });
}

export async function createNotification(
  token: string,
  input: CreateNotificationInput,
): Promise<NotificationRecord> {
  return apiRequest<NotificationRecord>(`/notifications`, {
    token,
    method: 'POST',
    body: input,
  });
}

export async function updateNotification(
  token: string,
  id: string,
  input: UpdateNotificationInput,
): Promise<NotificationRecord> {
  return apiRequest<NotificationRecord>(`/notifications/${id}`, {
    token,
    method: 'PATCH',
    body: input,
  });
}

export async function deleteNotification(token: string, id: string): Promise<{ success: boolean }> {
  return apiRequest(`/notifications/${id}`, { token, method: 'DELETE' });
}

export async function cloneNotification(token: string, id: string): Promise<NotificationRecord> {
  return apiRequest<NotificationRecord>(`/notifications/${id}/clone`, { token, method: 'POST' });
}

export async function exportNotificationCsv(token: string, query: NotificationQuery = {}): Promise<string> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<string>(`/notifications/export/csv?${params}`, { token, raw: true });
}
