import { fetchReviewList, createReview, updateReview, deleteReview } from '../reviews';

jest.mock('../client', () => ({
  apiRequest: jest.fn(),
}));

import { apiRequest } from '../client';

const mocked = apiRequest as jest.MockedFunction<typeof apiRequest>;

describe('reviews api client', () => {
  beforeEach(() => {
    mocked.mockReset();
  });

  it('fetchReviewList builds query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchReviewList('tok', { page: 2, status: 'active' });
    expect(mocked).toHaveBeenCalledWith(expect.stringContaining('/reviews?'), expect.objectContaining({ token: 'tok' }));
  });

  it('createReview posts body', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await createReview('tok', { status: 'draft' });
    expect(mocked).toHaveBeenCalledWith('/reviews', expect.objectContaining({ method: 'POST' }));
  });

  it('updateReview patches', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await updateReview('tok', '1', { status: 'active' });
    expect(mocked).toHaveBeenCalledWith('/reviews/1', expect.objectContaining({ method: 'PATCH' }));
  });

  it('deleteReview deletes', async () => {
    mocked.mockResolvedValue({ success: true });
    await deleteReview('tok', '1');
    expect(mocked).toHaveBeenCalledWith('/reviews/1', expect.objectContaining({ method: 'DELETE' }));
  });

  it('handles empty query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchReviewList('tok');
    expect(mocked).toHaveBeenCalled();
  });
});
