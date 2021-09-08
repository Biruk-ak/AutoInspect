import { aggregateGarageOperationsScore, runGarageOperationsSuite, garageOperationsRule1 } from './GarageOperations';

describe('GarageOperations rules', () => {
  it('rule1 returns score', () => {
    const result = garageOperationsRule1({ value: 50 });
    expect(result.score).toBeGreaterThanOrEqual(0);
  });

  it('suite returns 80 results', () => {
    expect(runGarageOperationsSuite({ value: 10 })).toHaveLength(80);
  });

  it('aggregate returns average', () => {
    expect(aggregateGarageOperationsScore({ value: 20, urgent: true })).toBeGreaterThan(0);
  });
});
