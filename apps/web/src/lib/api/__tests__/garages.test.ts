import { fetchGarageList, createGarage, updateGarage, deleteGarage } from '../garages';

jest.mock('../client', () => ({
  apiRequest: jest.fn(),
}));

import { apiRequest } from '../client';

const mocked = apiRequest as jest.MockedFunction<typeof apiRequest>;

describe('garages api client', () => {
  beforeEach(() => {
    mocked.mockReset();
  });

  it('fetchGarageList builds query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchGarageList('tok', { page: 2, status: 'active' });
    expect(mocked).toHaveBeenCalledWith(expect.stringContaining('/garages?'), expect.objectContaining({ token: 'tok' }));
  });

  it('createGarage posts body', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await createGarage('tok', { status: 'draft' });
    expect(mocked).toHaveBeenCalledWith('/garages', expect.objectContaining({ method: 'POST' }));
  });

  it('updateGarage patches', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await updateGarage('tok', '1', { status: 'active' });
    expect(mocked).toHaveBeenCalledWith('/garages/1', expect.objectContaining({ method: 'PATCH' }));
  });

  it('deleteGarage deletes', async () => {
    mocked.mockResolvedValue({ success: true });
    await deleteGarage('tok', '1');
    expect(mocked).toHaveBeenCalledWith('/garages/1', expect.objectContaining({ method: 'DELETE' }));
  });

  it('handles empty query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchGarageList('tok');
    expect(mocked).toHaveBeenCalled();
  });
});
