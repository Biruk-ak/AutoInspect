import { PaymentGatewayHelper } from './paymentGateway.helper';

describe('PaymentGatewayHelper', () => {
  const helper = new PaymentGatewayHelper();

  it('normalizes input', () => {
    expect(helper.normalize({ ' a ': ' b ' })).toEqual({ a: 'b' });
  });

  it('validates object', () => {
    expect(helper.validate({}, 1).ok).toBe(true);
    expect(helper.validate(null as any, 1).ok).toBe(false);
  });

  it('enriches and transforms', async () => {
    const enriched = await helper.enrich({ n: 1 }, 2);
    const transformed = await helper.transform(enriched, 2);
    expect(transformed.enrichmentStep).toBe(2);
  });

  it('processStep1 works', async () => {
    const result = await helper.processStep1({ value: 1 });
    expect(result.step).toBe(1);
  });

  it('runPipeline returns steps', async () => {
    const results = await helper.runPipeline({ value: 1 }, 3);
    expect(results).toHaveLength(3);
  });
});
