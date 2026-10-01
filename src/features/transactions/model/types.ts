import type { Money } from '@/shared/lib/money';

export interface Category {
  id: string;
  name: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  merchant: string;
  /** Negative for money out, positive for money in. */
  amount: Money;
  /** ISO 8601, UTC. */
  date: string;
  categoryId: string | null;
}

export interface TransactionPage {
  items: Transaction[];
  /** Pass back to get the next page; null on the last page. */
  nextCursor: string | null;
}
