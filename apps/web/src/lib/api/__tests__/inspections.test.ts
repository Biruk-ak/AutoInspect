import { fetchInspectionList, createInspection, updateInspection, deleteInspection } from '../inspections';

jest.mock('../client', () => ({
  apiRequest: jest.fn(),
}));

import { apiRequest } from '../client';

const mocked = apiRequest as jest.MockedFunction<typeof apiRequest>;

describe('inspections api client', () => {
  beforeEach(() => {
    mocked.mockReset();
  });

  it('fetchInspectionList builds query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchInspectionList('tok', { page: 2, status: 'active' });
    expect(mocked).toHaveBeenCalledWith(expect.stringContaining('/inspections?'), expect.objectContaining({ token: 'tok' }));
  });

  it('createInspection posts body', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await createInspection('tok', { status: 'draft' });
    expect(mocked).toHaveBeenCalledWith('/inspections', expect.objectContaining({ method: 'POST' }));
  });

  it('updateInspection patches', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await updateInspection('tok', '1', { status: 'active' });
    expect(mocked).toHaveBeenCalledWith('/inspections/1', expect.objectContaining({ method: 'PATCH' }));
  });

  it('deleteInspection deletes', async () => {
    mocked.mockResolvedValue({ success: true });
    await deleteInspection('tok', '1');
    expect(mocked).toHaveBeenCalledWith('/inspections/1', expect.objectContaining({ method: 'DELETE' }));
  });

  it('handles empty query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchInspectionList('tok');
    expect(mocked).toHaveBeenCalled();
  });
});
