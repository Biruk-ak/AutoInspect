import { aggregatePaymentLedgerScore, runPaymentLedgerSuite, paymentLedgerRule1 } from './PaymentLedger';

describe('PaymentLedger rules', () => {
  it('rule1 returns score', () => {
    const result = paymentLedgerRule1({ value: 50 });
    expect(result.score).toBeGreaterThanOrEqual(0);
  });

  it('suite returns 80 results', () => {
    expect(runPaymentLedgerSuite({ value: 10 })).toHaveLength(80);
  });

  it('aggregate returns average', () => {
    expect(aggregatePaymentLedgerScore({ value: 20, urgent: true })).toBeGreaterThan(0);
  });
});
