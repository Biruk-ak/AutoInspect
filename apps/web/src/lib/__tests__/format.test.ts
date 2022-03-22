import { formatCurrency, formatDate, formatRelative, truncate } from '../format';

describe('format utils', () => {
  it('formats currency', () => {
    expect(formatCurrency(12.5, 'USD')).toContain('12.50');
  });

  it('formats date', () => {
    expect(formatDate('2022-01-01T00:00:00.000Z')).not.toBe('—');
  });

  it('formats relative', () => {
    expect(formatRelative(new Date())).toBe('just now');
  });

  it('truncates', () => {
    expect(truncate('abcdefghij', 5)).toBe('abcd…');
  });
});
