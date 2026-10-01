/**
 * @jest-environment node
 *
 * M4 — money is integer cents, formatted only at the edge, in the device locale.
 */
import { accounts, transactions } from '../../src/mocks/data';
import { formatMoney } from '../../src/shared/lib/money';

describe('money (M4)', () => {
  it('is always a whole number of cents', () => {
    const amounts = [...accounts.map((a) => a.balance), ...transactions.map((t) => t.amount)];
    expect(amounts.every((m) => Number.isInteger(m.amount))).toBe(true);
  });

  it.each([
    ['en-US', 1_234_567, '€12,345.67'],
    ['es-ES', -1_234_567, '-12.345,67 €'],
  ])('formats for %s', (locale, amount, expected) => {
    expect(formatMoney({ amount, currency: 'EUR' }, locale)).toBe(expected);
  });
});
