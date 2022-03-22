import { fetchReportList, createReport, updateReport, deleteReport } from '../reports';

jest.mock('../client', () => ({
  apiRequest: jest.fn(),
}));

import { apiRequest } from '../client';

const mocked = apiRequest as jest.MockedFunction<typeof apiRequest>;

describe('reports api client', () => {
  beforeEach(() => {
    mocked.mockReset();
  });

  it('fetchReportList builds query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchReportList('tok', { page: 2, status: 'active' });
    expect(mocked).toHaveBeenCalledWith(expect.stringContaining('/reports?'), expect.objectContaining({ token: 'tok' }));
  });

  it('createReport posts body', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await createReport('tok', { status: 'draft' });
    expect(mocked).toHaveBeenCalledWith('/reports', expect.objectContaining({ method: 'POST' }));
  });

  it('updateReport patches', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await updateReport('tok', '1', { status: 'active' });
    expect(mocked).toHaveBeenCalledWith('/reports/1', expect.objectContaining({ method: 'PATCH' }));
  });

  it('deleteReport deletes', async () => {
    mocked.mockResolvedValue({ success: true });
    await deleteReport('tok', '1');
    expect(mocked).toHaveBeenCalledWith('/reports/1', expect.objectContaining({ method: 'DELETE' }));
  });

  it('handles empty query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchReportList('tok');
    expect(mocked).toHaveBeenCalled();
  });
});
