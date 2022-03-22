import { fetchComplianceList, createCompliance, updateCompliance, deleteCompliance } from '../compliance';

jest.mock('../client', () => ({
  apiRequest: jest.fn(),
}));

import { apiRequest } from '../client';

const mocked = apiRequest as jest.MockedFunction<typeof apiRequest>;

describe('compliance api client', () => {
  beforeEach(() => {
    mocked.mockReset();
  });

  it('fetchComplianceList builds query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchComplianceList('tok', { page: 2, status: 'active' });
    expect(mocked).toHaveBeenCalledWith(expect.stringContaining('/compliance?'), expect.objectContaining({ token: 'tok' }));
  });

  it('createCompliance posts body', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await createCompliance('tok', { status: 'draft' });
    expect(mocked).toHaveBeenCalledWith('/compliance', expect.objectContaining({ method: 'POST' }));
  });

  it('updateCompliance patches', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await updateCompliance('tok', '1', { status: 'active' });
    expect(mocked).toHaveBeenCalledWith('/compliance/1', expect.objectContaining({ method: 'PATCH' }));
  });

  it('deleteCompliance deletes', async () => {
    mocked.mockResolvedValue({ success: true });
    await deleteCompliance('tok', '1');
    expect(mocked).toHaveBeenCalledWith('/compliance/1', expect.objectContaining({ method: 'DELETE' }));
  });

  it('handles empty query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchComplianceList('tok');
    expect(mocked).toHaveBeenCalled();
  });
});
