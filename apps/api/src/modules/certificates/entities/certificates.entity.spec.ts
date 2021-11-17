import { VehicleCertificate } from './certificates.entity';

describe('VehicleCertificate', () => {
  const make = () => {
    const e = new VehicleCertificate();
    e.id = '1';
    e.status = 'draft';
    e.organizationId = 'org';
    e.createdAt = new Date();
    e.updatedAt = new Date();
    e.isActive = true;
    e.isDeleted = false;
    e.priority = 10;
    e.tags = ['a'];
    e.metadata = {};
    e.version = 1;
    e.notes = 'n';
    e.locale = 'en';
    e.currency = 'USD';
    e.amount = 5;
    e.quantity = 1;
    e.externalRef = 'ref';
    return e;
  };

  it('summarize returns core fields', () => {
    const s = make().summarize();
    expect(s.id).toBe('1');
    expect(s.status).toBe('draft');
  });

  it('softDeactivate marks deleted', () => {
    const e = make();
    e.softDeactivate('u');
    expect(e.isActive).toBe(false);
    expect(e.isDeleted).toBe(true);
    expect(e.updatedBy).toBe('u');
  });

  it('activate restores', () => {
    const e = make();
    e.softDeactivate('u');
    e.activate('u2');
    expect(e.isActive).toBe(true);
    expect(e.deletedAt).toBeNull();
  });

  it('applyMetadata merges', () => {
    const e = make();
    e.applyMetadata({ x: 1 });
    expect(e.metadata).toEqual({ x: 1 });
  });

  it('addTag is idempotent', () => {
    const e = make();
    e.addTag('a');
    e.addTag('b');
    expect(e.tags).toEqual(['a', 'b']);
  });

  it('removeTag works', () => {
    const e = make();
    e.removeTag('a');
    expect(e.tags).toEqual([]);
  });

  it('setPriority validates', () => {
    const e = make();
    expect(() => e.setPriority(-1)).toThrow();
    e.setPriority(80);
    expect(e.priority).toBe(80);
  });

  it('toPublicDto includes amount', () => {
    expect(make().toPublicDto().amount).toBe(5);
  });
});
