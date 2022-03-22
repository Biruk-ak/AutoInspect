import { apiRequest } from './client';

export interface WorkOrderRecord {
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

export interface WorkOrderQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  organizationId?: string;
  vehicleId?: string;
  from?: string;
  to?: string;
}

export interface CreateWorkOrderInput {
  status?: string;
  notes?: string;
  organizationId?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateWorkOrderInput {
  status?: string;
  notes?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  metadata?: Record<string, unknown>;
}

export async function fetchWorkOrderList(
  token: string,
  query: WorkOrderQuery = {},
): Promise<ListResponse<WorkOrderRecord>> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<ListResponse<WorkOrderRecord>>(`/workorders?${params}`, { token });
}

export async function fetchWorkOrderById(token: string, id: string): Promise<WorkOrderRecord> {
  return apiRequest<WorkOrderRecord>(`/workorders/${id}`, { token });
}

export async function createWorkOrder(
  token: string,
  input: CreateWorkOrderInput,
): Promise<WorkOrderRecord> {
  return apiRequest<WorkOrderRecord>(`/workorders`, {
    token,
    method: 'POST',
    body: input,
  });
}

export async function updateWorkOrder(
  token: string,
  id: string,
  input: UpdateWorkOrderInput,
): Promise<WorkOrderRecord> {
  return apiRequest<WorkOrderRecord>(`/workorders/${id}`, {
    token,
    method: 'PATCH',
    body: input,
  });
}

export async function deleteWorkOrder(token: string, id: string): Promise<{ success: boolean }> {
  return apiRequest(`/workorders/${id}`, { token, method: 'DELETE' });
}

export async function cloneWorkOrder(token: string, id: string): Promise<WorkOrderRecord> {
  return apiRequest<WorkOrderRecord>(`/workorders/${id}/clone`, { token, method: 'POST' });
}

export async function exportWorkOrderCsv(token: string, query: WorkOrderQuery = {}): Promise<string> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<string>(`/workorders/export/csv?${params}`, { token, raw: true });
}
