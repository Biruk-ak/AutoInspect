import { apiRequest } from './client';

export interface MessageRecord {
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

export interface MessageQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  organizationId?: string;
  vehicleId?: string;
  from?: string;
  to?: string;
}

export interface CreateMessageInput {
  status?: string;
  notes?: string;
  organizationId?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateMessageInput {
  status?: string;
  notes?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  metadata?: Record<string, unknown>;
}

export async function fetchMessageList(
  token: string,
  query: MessageQuery = {},
): Promise<ListResponse<MessageRecord>> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<ListResponse<MessageRecord>>(`/messages?${params}`, { token });
}

export async function fetchMessageById(token: string, id: string): Promise<MessageRecord> {
  return apiRequest<MessageRecord>(`/messages/${id}`, { token });
}

export async function createMessage(
  token: string,
  input: CreateMessageInput,
): Promise<MessageRecord> {
  return apiRequest<MessageRecord>(`/messages`, {
    token,
    method: 'POST',
    body: input,
  });
}

export async function updateMessage(
  token: string,
  id: string,
  input: UpdateMessageInput,
): Promise<MessageRecord> {
  return apiRequest<MessageRecord>(`/messages/${id}`, {
    token,
    method: 'PATCH',
    body: input,
  });
}

export async function deleteMessage(token: string, id: string): Promise<{ success: boolean }> {
  return apiRequest(`/messages/${id}`, { token, method: 'DELETE' });
}

export async function cloneMessage(token: string, id: string): Promise<MessageRecord> {
  return apiRequest<MessageRecord>(`/messages/${id}/clone`, { token, method: 'POST' });
}

export async function exportMessageCsv(token: string, query: MessageQuery = {}): Promise<string> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<string>(`/messages/export/csv?${params}`, { token, raw: true });
}
