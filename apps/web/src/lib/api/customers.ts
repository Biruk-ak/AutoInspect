import { apiRequest } from './client';

export interface CustomerRecord {
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

export interface CustomerQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  organizationId?: string;
  vehicleId?: string;
  from?: string;
  to?: string;
}

export interface CreateCustomerInput {
  status?: string;
  notes?: string;
  organizationId?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateCustomerInput {
  status?: string;
  notes?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  metadata?: Record<string, unknown>;
}

export async function fetchCustomerList(
  token: string,
  query: CustomerQuery = {},
): Promise<ListResponse<CustomerRecord>> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<ListResponse<CustomerRecord>>(`/customers?${params}`, { token });
}

export async function fetchCustomerById(token: string, id: string): Promise<CustomerRecord> {
  return apiRequest<CustomerRecord>(`/customers/${id}`, { token });
}

export async function createCustomer(
  token: string,
  input: CreateCustomerInput,
): Promise<CustomerRecord> {
  return apiRequest<CustomerRecord>(`/customers`, {
    token,
    method: 'POST',
    body: input,
  });
}

export async function updateCustomer(
  token: string,
  id: string,
  input: UpdateCustomerInput,
): Promise<CustomerRecord> {
  return apiRequest<CustomerRecord>(`/customers/${id}`, {
    token,
    method: 'PATCH',
    body: input,
  });
}

export async function deleteCustomer(token: string, id: string): Promise<{ success: boolean }> {
  return apiRequest(`/customers/${id}`, { token, method: 'DELETE' });
}

export async function cloneCustomer(token: string, id: string): Promise<CustomerRecord> {
  return apiRequest<CustomerRecord>(`/customers/${id}/clone`, { token, method: 'POST' });
}

export async function exportCustomerCsv(token: string, query: CustomerQuery = {}): Promise<string> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<string>(`/customers/export/csv?${params}`, { token, raw: true });
}
