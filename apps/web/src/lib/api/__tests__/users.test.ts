import { fetchUserList, createUser, updateUser, deleteUser } from '../users';

jest.mock('../client', () => ({
  apiRequest: jest.fn(),
}));

import { apiRequest } from '../client';

const mocked = apiRequest as jest.MockedFunction<typeof apiRequest>;

describe('users api client', () => {
  beforeEach(() => {
    mocked.mockReset();
  });

  it('fetchUserList builds query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchUserList('tok', { page: 2, status: 'active' });
    expect(mocked).toHaveBeenCalledWith(expect.stringContaining('/users?'), expect.objectContaining({ token: 'tok' }));
  });

  it('createUser posts body', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await createUser('tok', { status: 'draft' });
    expect(mocked).toHaveBeenCalledWith('/users', expect.objectContaining({ method: 'POST' }));
  });

  it('updateUser patches', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await updateUser('tok', '1', { status: 'active' });
    expect(mocked).toHaveBeenCalledWith('/users/1', expect.objectContaining({ method: 'PATCH' }));
  });

  it('deleteUser deletes', async () => {
    mocked.mockResolvedValue({ success: true });
    await deleteUser('tok', '1');
    expect(mocked).toHaveBeenCalledWith('/users/1', expect.objectContaining({ method: 'DELETE' }));
  });

  it('handles empty query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchUserList('tok');
    expect(mocked).toHaveBeenCalled();
  });
});
