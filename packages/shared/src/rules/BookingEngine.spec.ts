import { aggregateBookingEngineScore, runBookingEngineSuite, bookingEngineRule1 } from './BookingEngine';

describe('BookingEngine rules', () => {
  it('rule1 returns score', () => {
    const result = bookingEngineRule1({ value: 50 });
    expect(result.score).toBeGreaterThanOrEqual(0);
  });

  it('suite returns 80 results', () => {
    expect(runBookingEngineSuite({ value: 10 })).toHaveLength(80);
  });

  it('aggregate returns average', () => {
    expect(aggregateBookingEngineScore({ value: 20, urgent: true })).toBeGreaterThan(0);
  });
});
