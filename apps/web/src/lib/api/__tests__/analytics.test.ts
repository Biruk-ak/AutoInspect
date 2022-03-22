import { fetchAnalyticsList, createAnalytics, updateAnalytics, deleteAnalytics } from '../analytics';

jest.mock('../client', () => ({
  apiRequest: jest.fn(),
}));

import { apiRequest } from '../client';

const mocked = apiRequest as jest.MockedFunction<typeof apiRequest>;

describe('analytics api client', () => {
  beforeEach(() => {
    mocked.mockReset();
  });

  it('fetchAnalyticsList builds query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchAnalyticsList('tok', { page: 2, status: 'active' });
    expect(mocked).toHaveBeenCalledWith(expect.stringContaining('/analytics?'), expect.objectContaining({ token: 'tok' }));
  });

  it('createAnalytics posts body', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await createAnalytics('tok', { status: 'draft' });
    expect(mocked).toHaveBeenCalledWith('/analytics', expect.objectContaining({ method: 'POST' }));
  });

  it('updateAnalytics patches', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await updateAnalytics('tok', '1', { status: 'active' });
    expect(mocked).toHaveBeenCalledWith('/analytics/1', expect.objectContaining({ method: 'PATCH' }));
  });

  it('deleteAnalytics deletes', async () => {
    mocked.mockResolvedValue({ success: true });
    await deleteAnalytics('tok', '1');
    expect(mocked).toHaveBeenCalledWith('/analytics/1', expect.objectContaining({ method: 'DELETE' }));
  });

  it('handles empty query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchAnalyticsList('tok');
    expect(mocked).toHaveBeenCalled();
  });
});
