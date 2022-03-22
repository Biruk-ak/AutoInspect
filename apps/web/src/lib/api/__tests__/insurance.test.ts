import { fetchInsuranceList, createInsurance, updateInsurance, deleteInsurance } from '../insurance';

jest.mock('../client', () => ({
  apiRequest: jest.fn(),
}));

import { apiRequest } from '../client';

const mocked = apiRequest as jest.MockedFunction<typeof apiRequest>;

describe('insurance api client', () => {
  beforeEach(() => {
    mocked.mockReset();
  });

  it('fetchInsuranceList builds query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchInsuranceList('tok', { page: 2, status: 'active' });
    expect(mocked).toHaveBeenCalledWith(expect.stringContaining('/insurance?'), expect.objectContaining({ token: 'tok' }));
  });

  it('createInsurance posts body', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await createInsurance('tok', { status: 'draft' });
    expect(mocked).toHaveBeenCalledWith('/insurance', expect.objectContaining({ method: 'POST' }));
  });

  it('updateInsurance patches', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await updateInsurance('tok', '1', { status: 'active' });
    expect(mocked).toHaveBeenCalledWith('/insurance/1', expect.objectContaining({ method: 'PATCH' }));
  });

  it('deleteInsurance deletes', async () => {
    mocked.mockResolvedValue({ success: true });
    await deleteInsurance('tok', '1');
    expect(mocked).toHaveBeenCalledWith('/insurance/1', expect.objectContaining({ method: 'DELETE' }));
  });

  it('handles empty query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchInsuranceList('tok');
    expect(mocked).toHaveBeenCalled();
  });
});
