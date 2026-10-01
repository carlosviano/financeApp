/**
 * @jest-environment node
 *
 * M1–M3 against the same mock API the app uses, through `getJson`.
 */
import { getAccounts } from '../../src/features/accounts';
import { getBudgets } from '../../src/features/budgets';
import { getCategories, getTransaction, getTransactionPage } from '../../src/features/transactions';
import { transactionKeys } from '../../src/features/transactions/api/keys';
import type { Transaction } from '../../src/features/transactions';
import { mockTransport } from '../../src/mocks/handlers';
import { HttpError, setTransport } from '../../src/shared/lib/api';

beforeAll(() => {
  setTransport(mockTransport);
});

describe('mock API (M1)', () => {
  it('serves accounts, categories and budgets', async () => {
    expect((await getAccounts()).length).toBeGreaterThan(0);
    expect((await getCategories()).length).toBeGreaterThan(0);
    const budgets = await getBudgets();
    expect(budgets.length).toBeGreaterThan(0);
    expect(budgets.every((b) => b.month === '2026-09' && b.spent.amount >= 0)).toBe(true);
  });

  it('serves one transaction, and 404 for an unknown id', async () => {
    const [first] = (await getTransactionPage(null)).items;
    expect(await getTransaction(first?.id ?? '')).toEqual(first);
    await expect(getTransaction('nope')).rejects.toMatchObject({ status: 404 });
  });
});

describe('transaction pages (M2)', () => {
  const readAll = async () => {
    const pages = [];
    let cursor: string | null = null;
    do {
      const page = await getTransactionPage(cursor);
      pages.push(page);
      cursor = page.nextCursor;
    } while (cursor);
    return pages;
  };

  it('returns pages of 20, newest first, and a null cursor on the last page', async () => {
    const pages = await readAll();
    const items: Transaction[] = pages.flatMap((p) => p.items);

    // 20 is written out, not imported: the spec says 20, so changing the
    // constant in the handlers should fail this test.
    expect(pages.slice(0, -1).every((p) => p.items.length === 20)).toBe(true);
    expect(pages.at(-1)?.nextCursor).toBeNull();
    expect(new Set(items.map((t) => t.id)).size).toBe(items.length);
    expect(items.map((t) => t.date)).toEqual([...items.map((t) => t.date)].sort().reverse());
  });

  it('rejects a cursor it did not issue', async () => {
    await expect(getTransactionPage('made-up')).rejects.toBeInstanceOf(HttpError);
  });
});

describe('query keys (M3)', () => {
  it('nests every key under the feature root, so invalidating it reaches all of them', () => {
    expect(transactionKeys.list().slice(0, 1)).toEqual(transactionKeys.all);
    expect(transactionKeys.detail('tx-1').slice(0, 1)).toEqual(transactionKeys.all);
  });
});
