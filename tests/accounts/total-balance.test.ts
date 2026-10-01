/**
 * @jest-environment node
 *
 * H1 — the total balance, in integer minor units.
 */
import { getTotalBalance, type Account } from '../../src/features/accounts';

const account = (amount: number, currency = 'EUR'): Account => ({
  id: `acc-${String(amount)}-${currency}`,
  name: 'Account',
  kind: 'checking',
  balance: { amount, currency },
});

describe('getTotalBalance', () => {
  it('adds every balance, negative ones included', () => {
    const accounts = [account(324518), account(1250000), account(-48230)];
    expect(getTotalBalance(accounts)).toEqual({ amount: 1526288, currency: 'EUR' });
  });

  it('is exact where floats are not', () => {
    // 0.10 € + 0.20 € is 0.30000000000000004 € in floating point.
    expect(getTotalBalance([account(10), account(20)])).toEqual({ amount: 30, currency: 'EUR' });
  });

  it('returns null with no accounts', () => {
    expect(getTotalBalance([])).toBeNull();
  });

  it('returns null rather than adding different currencies', () => {
    expect(getTotalBalance([account(1000), account(1000, 'USD')])).toBeNull();
  });
});
