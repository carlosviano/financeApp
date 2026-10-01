import type { Money } from '@/shared/lib/money';

import type { Account } from './types';

/**
 * The sum of every account's balance, in minor units (H1).
 *
 * Returns null when there is nothing honest to show: no accounts, or accounts
 * in different currencies. Adding euros to dollars would print a wrong number,
 * and converting them needs exchange rates the app doesn't have.
 */
export function getTotalBalance(accounts: Account[]): Money | null {
  const [first] = accounts;
  if (!first) {
    return null;
  }

  const currency = first.balance.currency;
  let total = 0;
  for (const account of accounts) {
    if (account.balance.currency !== currency) {
      return null;
    }
    total += account.balance.amount;
  }

  return { amount: total, currency };
}
