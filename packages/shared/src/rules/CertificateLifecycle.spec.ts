import { aggregateCertificateLifecycleScore, runCertificateLifecycleSuite, certificateLifecycleRule1 } from './CertificateLifecycle';

describe('CertificateLifecycle rules', () => {
  it('rule1 returns score', () => {
    const result = certificateLifecycleRule1({ value: 50 });
    expect(result.score).toBeGreaterThanOrEqual(0);
  });

  it('suite returns 80 results', () => {
    expect(runCertificateLifecycleSuite({ value: 10 })).toHaveLength(80);
  });

  it('aggregate returns average', () => {
    expect(aggregateCertificateLifecycleScore({ value: 20, urgent: true })).toBeGreaterThan(0);
  });
});
