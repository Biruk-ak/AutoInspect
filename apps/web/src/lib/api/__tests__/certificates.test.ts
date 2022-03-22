import { fetchCertificateList, createCertificate, updateCertificate, deleteCertificate } from '../certificates';

jest.mock('../client', () => ({
  apiRequest: jest.fn(),
}));

import { apiRequest } from '../client';

const mocked = apiRequest as jest.MockedFunction<typeof apiRequest>;

describe('certificates api client', () => {
  beforeEach(() => {
    mocked.mockReset();
  });

  it('fetchCertificateList builds query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchCertificateList('tok', { page: 2, status: 'active' });
    expect(mocked).toHaveBeenCalledWith(expect.stringContaining('/certificates?'), expect.objectContaining({ token: 'tok' }));
  });

  it('createCertificate posts body', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await createCertificate('tok', { status: 'draft' });
    expect(mocked).toHaveBeenCalledWith('/certificates', expect.objectContaining({ method: 'POST' }));
  });

  it('updateCertificate patches', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await updateCertificate('tok', '1', { status: 'active' });
    expect(mocked).toHaveBeenCalledWith('/certificates/1', expect.objectContaining({ method: 'PATCH' }));
  });

  it('deleteCertificate deletes', async () => {
    mocked.mockResolvedValue({ success: true });
    await deleteCertificate('tok', '1');
    expect(mocked).toHaveBeenCalledWith('/certificates/1', expect.objectContaining({ method: 'DELETE' }));
  });

  it('handles empty query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchCertificateList('tok');
    expect(mocked).toHaveBeenCalled();
  });
});
