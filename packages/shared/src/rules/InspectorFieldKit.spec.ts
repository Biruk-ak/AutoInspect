import { aggregateInspectorFieldKitScore, runInspectorFieldKitSuite, inspectorFieldKitRule1 } from './InspectorFieldKit';

describe('InspectorFieldKit rules', () => {
  it('rule1 returns score', () => {
    const result = inspectorFieldKitRule1({ value: 50 });
    expect(result.score).toBeGreaterThanOrEqual(0);
  });

  it('suite returns 80 results', () => {
    expect(runInspectorFieldKitSuite({ value: 10 })).toHaveLength(80);
  });

  it('aggregate returns average', () => {
    expect(aggregateInspectorFieldKitScore({ value: 20, urgent: true })).toBeGreaterThan(0);
  });
});
