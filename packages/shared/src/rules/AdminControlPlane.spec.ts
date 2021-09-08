import { aggregateAdminControlPlaneScore, runAdminControlPlaneSuite, adminControlPlaneRule1 } from './AdminControlPlane';

describe('AdminControlPlane rules', () => {
  it('rule1 returns score', () => {
    const result = adminControlPlaneRule1({ value: 50 });
    expect(result.score).toBeGreaterThanOrEqual(0);
  });

  it('suite returns 80 results', () => {
    expect(runAdminControlPlaneSuite({ value: 10 })).toHaveLength(80);
  });

  it('aggregate returns average', () => {
    expect(aggregateAdminControlPlaneScore({ value: 20, urgent: true })).toBeGreaterThan(0);
  });
});
