import { aggregateCustomerJourneyScore, runCustomerJourneySuite, customerJourneyRule1 } from './CustomerJourney';

describe('CustomerJourney rules', () => {
  it('rule1 returns score', () => {
    const result = customerJourneyRule1({ value: 50 });
    expect(result.score).toBeGreaterThanOrEqual(0);
  });

  it('suite returns 80 results', () => {
    expect(runCustomerJourneySuite({ value: 10 })).toHaveLength(80);
  });

  it('aggregate returns average', () => {
    expect(aggregateCustomerJourneyScore({ value: 20, urgent: true })).toBeGreaterThan(0);
  });
});
