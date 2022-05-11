import { AnalyticsService } from '../AnalyticsService';

jest.mock('@/lib/api/client', () => ({
  apiRequest: jest.fn().mockResolvedValue({ ok: true }),
}));

describe('AnalyticsService', () => {
  const service = new AnalyticsService('token');

  it('sanitizes strings', () => {
    expect(service.sanitize({ a: ' x ' })).toEqual({ a: 'x' });
  });

  it('validates payload', () => {
    expect(service.validatePayload({}, 1).ok).toBe(true);
    expect(service.validatePayload(null as any, 1).ok).toBe(false);
  });

  it('operation1 returns result', async () => {
    const result = await service.operation1({ value: 1 });
    expect(result.operation).toBe(1);
  });

  it('prepare adds metadata', async () => {
    const prepared = await service.prepare({ a: 1 }, 2);
    expect(prepared.operation).toBe(2);
  });
});
