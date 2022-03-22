import { apiRequest } from './client';

export interface ReportRecord {
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

export interface ReportQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  organizationId?: string;
  vehicleId?: string;
  from?: string;
  to?: string;
}

export interface CreateReportInput {
  status?: string;
  notes?: string;
  organizationId?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateReportInput {
  status?: string;
  notes?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  metadata?: Record<string, unknown>;
}

export async function fetchReportList(
  token: string,
  query: ReportQuery = {},
): Promise<ListResponse<ReportRecord>> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<ListResponse<ReportRecord>>(`/reports?${params}`, { token });
}

export async function fetchReportById(token: string, id: string): Promise<ReportRecord> {
  return apiRequest<ReportRecord>(`/reports/${id}`, { token });
}

export async function createReport(
  token: string,
  input: CreateReportInput,
): Promise<ReportRecord> {
  return apiRequest<ReportRecord>(`/reports`, {
    token,
    method: 'POST',
    body: input,
  });
}

export async function updateReport(
  token: string,
  id: string,
  input: UpdateReportInput,
): Promise<ReportRecord> {
  return apiRequest<ReportRecord>(`/reports/${id}`, {
    token,
    method: 'PATCH',
    body: input,
  });
}

export async function deleteReport(token: string, id: string): Promise<{ success: boolean }> {
  return apiRequest(`/reports/${id}`, { token, method: 'DELETE' });
}

export async function cloneReport(token: string, id: string): Promise<ReportRecord> {
  return apiRequest<ReportRecord>(`/reports/${id}/clone`, { token, method: 'POST' });
}

export async function exportReportCsv(token: string, query: ReportQuery = {}): Promise<string> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<string>(`/reports/export/csv?${params}`, { token, raw: true });
}
