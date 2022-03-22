import { apiRequest } from './client';

export interface InventoryRecord {
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

export interface InventoryQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  organizationId?: string;
  vehicleId?: string;
  from?: string;
  to?: string;
}

export interface CreateInventoryInput {
  status?: string;
  notes?: string;
  organizationId?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateInventoryInput {
  status?: string;
  notes?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  metadata?: Record<string, unknown>;
}

export async function fetchInventoryList(
  token: string,
  query: InventoryQuery = {},
): Promise<ListResponse<InventoryRecord>> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<ListResponse<InventoryRecord>>(`/inventory?${params}`, { token });
}

export async function fetchInventoryById(token: string, id: string): Promise<InventoryRecord> {
  return apiRequest<InventoryRecord>(`/inventory/${id}`, { token });
}

export async function createInventory(
  token: string,
  input: CreateInventoryInput,
): Promise<InventoryRecord> {
  return apiRequest<InventoryRecord>(`/inventory`, {
    token,
    method: 'POST',
    body: input,
  });
}

export async function updateInventory(
  token: string,
  id: string,
  input: UpdateInventoryInput,
): Promise<InventoryRecord> {
  return apiRequest<InventoryRecord>(`/inventory/${id}`, {
    token,
    method: 'PATCH',
    body: input,
  });
}

export async function deleteInventory(token: string, id: string): Promise<{ success: boolean }> {
  return apiRequest(`/inventory/${id}`, { token, method: 'DELETE' });
}

export async function cloneInventory(token: string, id: string): Promise<InventoryRecord> {
  return apiRequest<InventoryRecord>(`/inventory/${id}/clone`, { token, method: 'POST' });
}

export async function exportInventoryCsv(token: string, query: InventoryQuery = {}): Promise<string> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<string>(`/inventory/export/csv?${params}`, { token, raw: true });
}
