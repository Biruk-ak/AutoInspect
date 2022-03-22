import { fetchSubscriptionList, createSubscription, updateSubscription, deleteSubscription } from '../subscriptions';

jest.mock('../client', () => ({
  apiRequest: jest.fn(),
}));

import { apiRequest } from '../client';

const mocked = apiRequest as jest.MockedFunction<typeof apiRequest>;

describe('subscriptions api client', () => {
  beforeEach(() => {
    mocked.mockReset();
  });

  it('fetchSubscriptionList builds query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchSubscriptionList('tok', { page: 2, status: 'active' });
    expect(mocked).toHaveBeenCalledWith(expect.stringContaining('/subscriptions?'), expect.objectContaining({ token: 'tok' }));
  });

  it('createSubscription posts body', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await createSubscription('tok', { status: 'draft' });
    expect(mocked).toHaveBeenCalledWith('/subscriptions', expect.objectContaining({ method: 'POST' }));
  });

  it('updateSubscription patches', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await updateSubscription('tok', '1', { status: 'active' });
    expect(mocked).toHaveBeenCalledWith('/subscriptions/1', expect.objectContaining({ method: 'PATCH' }));
  });

  it('deleteSubscription deletes', async () => {
    mocked.mockResolvedValue({ success: true });
    await deleteSubscription('tok', '1');
    expect(mocked).toHaveBeenCalledWith('/subscriptions/1', expect.objectContaining({ method: 'DELETE' }));
  });

  it('handles empty query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchSubscriptionList('tok');
    expect(mocked).toHaveBeenCalled();
  });
});
