import { fetchMessageList, createMessage, updateMessage, deleteMessage } from '../messages';

jest.mock('../client', () => ({
  apiRequest: jest.fn(),
}));

import { apiRequest } from '../client';

const mocked = apiRequest as jest.MockedFunction<typeof apiRequest>;

describe('messages api client', () => {
  beforeEach(() => {
    mocked.mockReset();
  });

  it('fetchMessageList builds query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchMessageList('tok', { page: 2, status: 'active' });
    expect(mocked).toHaveBeenCalledWith(expect.stringContaining('/messages?'), expect.objectContaining({ token: 'tok' }));
  });

  it('createMessage posts body', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await createMessage('tok', { status: 'draft' });
    expect(mocked).toHaveBeenCalledWith('/messages', expect.objectContaining({ method: 'POST' }));
  });

  it('updateMessage patches', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await updateMessage('tok', '1', { status: 'active' });
    expect(mocked).toHaveBeenCalledWith('/messages/1', expect.objectContaining({ method: 'PATCH' }));
  });

  it('deleteMessage deletes', async () => {
    mocked.mockResolvedValue({ success: true });
    await deleteMessage('tok', '1');
    expect(mocked).toHaveBeenCalledWith('/messages/1', expect.objectContaining({ method: 'DELETE' }));
  });

  it('handles empty query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchMessageList('tok');
    expect(mocked).toHaveBeenCalled();
  });
});
