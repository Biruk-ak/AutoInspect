import { aggregateMaintenancePlannerScore, runMaintenancePlannerSuite, maintenancePlannerRule1 } from './MaintenancePlanner';

describe('MaintenancePlanner rules', () => {
  it('rule1 returns score', () => {
    const result = maintenancePlannerRule1({ value: 50 });
    expect(result.score).toBeGreaterThanOrEqual(0);
  });

  it('suite returns 80 results', () => {
    expect(runMaintenancePlannerSuite({ value: 10 })).toHaveLength(80);
  });

  it('aggregate returns average', () => {
    expect(aggregateMaintenancePlannerScore({ value: 20, urgent: true })).toBeGreaterThan(0);
  });
});
