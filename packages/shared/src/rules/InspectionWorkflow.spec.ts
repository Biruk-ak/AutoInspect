import { aggregateInspectionWorkflowScore, runInspectionWorkflowSuite, inspectionWorkflowRule1 } from './InspectionWorkflow';

describe('InspectionWorkflow rules', () => {
  it('rule1 returns score', () => {
    const result = inspectionWorkflowRule1({ value: 50 });
    expect(result.score).toBeGreaterThanOrEqual(0);
  });

  it('suite returns 80 results', () => {
    expect(runInspectionWorkflowSuite({ value: 10 })).toHaveLength(80);
  });

  it('aggregate returns average', () => {
    expect(aggregateInspectionWorkflowScore({ value: 20, urgent: true })).toBeGreaterThan(0);
  });
});
