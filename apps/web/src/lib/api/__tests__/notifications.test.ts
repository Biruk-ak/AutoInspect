import { fetchNotificationList, createNotification, updateNotification, deleteNotification } from '../notifications';

jest.mock('../client', () => ({
  apiRequest: jest.fn(),
}));

import { apiRequest } from '../client';

const mocked = apiRequest as jest.MockedFunction<typeof apiRequest>;

describe('notifications api client', () => {
  beforeEach(() => {
    mocked.mockReset();
  });

  it('fetchNotificationList builds query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchNotificationList('tok', { page: 2, status: 'active' });
    expect(mocked).toHaveBeenCalledWith(expect.stringContaining('/notifications?'), expect.objectContaining({ token: 'tok' }));
  });

  it('createNotification posts body', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await createNotification('tok', { status: 'draft' });
    expect(mocked).toHaveBeenCalledWith('/notifications', expect.objectContaining({ method: 'POST' }));
  });

  it('updateNotification patches', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await updateNotification('tok', '1', { status: 'active' });
    expect(mocked).toHaveBeenCalledWith('/notifications/1', expect.objectContaining({ method: 'PATCH' }));
  });

  it('deleteNotification deletes', async () => {
    mocked.mockResolvedValue({ success: true });
    await deleteNotification('tok', '1');
    expect(mocked).toHaveBeenCalledWith('/notifications/1', expect.objectContaining({ method: 'DELETE' }));
  });

  it('handles empty query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchNotificationList('tok');
    expect(mocked).toHaveBeenCalled();
  });
});
