import { fetchSettingsList, createSettings, updateSettings, deleteSettings } from '../settings';

jest.mock('../client', () => ({
  apiRequest: jest.fn(),
}));

import { apiRequest } from '../client';

const mocked = apiRequest as jest.MockedFunction<typeof apiRequest>;

describe('settings api client', () => {
  beforeEach(() => {
    mocked.mockReset();
  });

  it('fetchSettingsList builds query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchSettingsList('tok', { page: 2, status: 'active' });
    expect(mocked).toHaveBeenCalledWith(expect.stringContaining('/settings?'), expect.objectContaining({ token: 'tok' }));
  });

  it('createSettings posts body', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await createSettings('tok', { status: 'draft' });
    expect(mocked).toHaveBeenCalledWith('/settings', expect.objectContaining({ method: 'POST' }));
  });

  it('updateSettings patches', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await updateSettings('tok', '1', { status: 'active' });
    expect(mocked).toHaveBeenCalledWith('/settings/1', expect.objectContaining({ method: 'PATCH' }));
  });

  it('deleteSettings deletes', async () => {
    mocked.mockResolvedValue({ success: true });
    await deleteSettings('tok', '1');
    expect(mocked).toHaveBeenCalledWith('/settings/1', expect.objectContaining({ method: 'DELETE' }));
  });

  it('handles empty query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchSettingsList('tok');
    expect(mocked).toHaveBeenCalled();
  });
});
