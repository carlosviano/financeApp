/**
 * @jest-environment node
 *
 * X1 — grouping by calendar day in the user's time zone.
 */
import { groupByDay } from '../../src/features/transactions/model/groupByDay';
import type { Transaction } from '../../src/features/transactions';
import { dayKey, formatDay } from '../../src/shared/lib/dates';

const transaction = (id: string, date: string): Transaction => ({
  id,
  accountId: 'acc-main',
  merchant: 'Shop',
  amount: { amount: -1000, currency: 'EUR' },
  date,
  categoryId: null,
});

describe('dayKey', () => {
  it('uses the given time zone, not UTC', () => {
    // 23:30 UTC on the 27th is already 01:30 on the 28th in Madrid.
    expect(dayKey('2026-09-27T23:30:00Z', 'UTC')).toBe('2026-09-27');
    expect(dayKey('2026-09-27T23:30:00Z', 'Europe/Madrid')).toBe('2026-09-28');
  });
});

describe('formatDay', () => {
  it('formats a day key without shifting the day', () => {
    expect(formatDay('2026-09-28', 'en-US')).toBe('Monday, September 28');
    expect(formatDay('2026-09-28', 'es-ES')).toBe('lunes, 28 de septiembre');
  });
});

describe('groupByDay', () => {
  it('makes one section per day and keeps the order (X1)', () => {
    const list = [
      transaction('a', '2026-09-28T18:00:00Z'),
      transaction('b', '2026-09-28T09:00:00Z'),
      transaction('c', '2026-09-26T12:00:00Z'),
    ];
    const sections = groupByDay(list, 'UTC');
    expect(sections.map((section) => section.day)).toEqual(['2026-09-28', '2026-09-26']);
    expect(sections[0]?.data.map((item) => item.id)).toEqual(['a', 'b']);
  });

  it('puts a late-night transaction on the local day', () => {
    const list = [
      transaction('a', '2026-09-28T09:00:00Z'),
      transaction('b', '2026-09-27T23:30:00Z'),
    ];
    expect(groupByDay(list, 'UTC')).toHaveLength(2);
    expect(groupByDay(list, 'Europe/Madrid')).toHaveLength(1);
  });

  it('returns no sections for no transactions', () => {
    expect(groupByDay([], 'UTC')).toEqual([]);
  });
});
