import type { Money } from '@/shared/lib/money';

export interface Budget {
  categoryId: string;
  /** `YYYY-MM`. */
  month: string;
  limit: Money;
  /** Money spent in that category and month, as a positive amount. */
  spent: Money;
}
