import { aggregateAnalyticsEngineScore, runAnalyticsEngineSuite, analyticsEngineRule1 } from './AnalyticsEngine';

describe('AnalyticsEngine rules', () => {
  it('rule1 returns score', () => {
    const result = analyticsEngineRule1({ value: 50 });
    expect(result.score).toBeGreaterThanOrEqual(0);
  });

  it('suite returns 80 results', () => {
    expect(runAnalyticsEngineSuite({ value: 10 })).toHaveLength(80);
  });

  it('aggregate returns average', () => {
    expect(aggregateAnalyticsEngineScore({ value: 20, urgent: true })).toBeGreaterThan(0);
  });
});
