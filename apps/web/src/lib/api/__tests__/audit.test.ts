import { fetchAuditList, createAudit, updateAudit, deleteAudit } from '../audit';

jest.mock('../client', () => ({
  apiRequest: jest.fn(),
}));

import { apiRequest } from '../client';

const mocked = apiRequest as jest.MockedFunction<typeof apiRequest>;

describe('audit api client', () => {
  beforeEach(() => {
    mocked.mockReset();
  });

  it('fetchAuditList builds query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchAuditList('tok', { page: 2, status: 'active' });
    expect(mocked).toHaveBeenCalledWith(expect.stringContaining('/audit?'), expect.objectContaining({ token: 'tok' }));
  });

  it('createAudit posts body', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await createAudit('tok', { status: 'draft' });
    expect(mocked).toHaveBeenCalledWith('/audit', expect.objectContaining({ method: 'POST' }));
  });

  it('updateAudit patches', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await updateAudit('tok', '1', { status: 'active' });
    expect(mocked).toHaveBeenCalledWith('/audit/1', expect.objectContaining({ method: 'PATCH' }));
  });

  it('deleteAudit deletes', async () => {
    mocked.mockResolvedValue({ success: true });
    await deleteAudit('tok', '1');
    expect(mocked).toHaveBeenCalledWith('/audit/1', expect.objectContaining({ method: 'DELETE' }));
  });

  it('handles empty query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchAuditList('tok');
    expect(mocked).toHaveBeenCalled();
  });
});
