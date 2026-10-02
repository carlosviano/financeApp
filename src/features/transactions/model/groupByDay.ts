import { dayKey } from '@/shared/lib/dates';

import type { Transaction } from './types';

export interface DaySection {
  /** "2026-09-28", in the user's time zone. */
  day: string;
  data: Transaction[];
}

/**
 * Groups transactions into one section per calendar day (X1). Keeps the input
 * order, so a newest-first list gives newest-first days.
 */
export function groupByDay(transactions: Transaction[], timeZone: string): DaySection[] {
  const sections: DaySection[] = [];

  for (const transaction of transactions) {
    const day = dayKey(transaction.date, timeZone);
    const last = sections[sections.length - 1];

    // The list is sorted, so a transaction either joins the last day or starts a new one.
    if (last?.day === day) {
      last.data.push(transaction);
    } else {
      sections.push({ day, data: [transaction] });
    }
  }

  return sections;
}
