import { fetchRegionList, createRegion, updateRegion, deleteRegion } from '../regions';

jest.mock('../client', () => ({
  apiRequest: jest.fn(),
}));

import { apiRequest } from '../client';

const mocked = apiRequest as jest.MockedFunction<typeof apiRequest>;

describe('regions api client', () => {
  beforeEach(() => {
    mocked.mockReset();
  });

  it('fetchRegionList builds query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchRegionList('tok', { page: 2, status: 'active' });
    expect(mocked).toHaveBeenCalledWith(expect.stringContaining('/regions?'), expect.objectContaining({ token: 'tok' }));
  });

  it('createRegion posts body', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await createRegion('tok', { status: 'draft' });
    expect(mocked).toHaveBeenCalledWith('/regions', expect.objectContaining({ method: 'POST' }));
  });

  it('updateRegion patches', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await updateRegion('tok', '1', { status: 'active' });
    expect(mocked).toHaveBeenCalledWith('/regions/1', expect.objectContaining({ method: 'PATCH' }));
  });

  it('deleteRegion deletes', async () => {
    mocked.mockResolvedValue({ success: true });
    await deleteRegion('tok', '1');
    expect(mocked).toHaveBeenCalledWith('/regions/1', expect.objectContaining({ method: 'DELETE' }));
  });

  it('handles empty query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchRegionList('tok');
    expect(mocked).toHaveBeenCalled();
  });
});
