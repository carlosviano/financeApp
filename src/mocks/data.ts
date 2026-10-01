/**
 * The mock API's data. Amounts are cents: 324518 means 3,245.18 €.
 *
 * Transactions are generated, not typed by hand. The "random" numbers come
 * from a fixed seed, so every run, test and screenshot gets the same data.
 */
import type { Account } from '@/features/accounts';
import type { Budget } from '@/features/budgets';
import type { Category, Transaction } from '@/features/transactions';

function euros(cents: number) {
  return { amount: cents, currency: 'EUR' };
}

/** The newest transaction's date. "This month" means this date's month. */
export const NEWEST = new Date('2026-09-28T18:30:00Z');

// --- Repeatable random numbers ---

let seed = 42;

/**
 * A number between 0 and 1, like Math.random(), but the same sequence every
 * run. Each call updates `seed` with a fixed formula (Park–Miller).
 */
function random(): number {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647;
}

/** A whole number between min and max. */
function randomBetween(min: number, max: number): number {
  return Math.round(min + random() * (max - min));
}

/** One item of the list, chosen at random. */
function randomItem<T>(items: T[]): T {
  const index = Math.floor(random() * items.length);
  return items[index] as T;
}

// --- Fixed data ---

export const accounts: Account[] = [
  { id: 'acc-main', name: 'Main account', kind: 'checking', balance: euros(324518) },
  { id: 'acc-savings', name: 'Savings', kind: 'savings', balance: euros(1250000) },
  { id: 'acc-card', name: 'Credit card', kind: 'credit', balance: euros(-48230) },
];

export const categories: Category[] = [
  { id: 'groceries', name: 'Groceries' },
  { id: 'eating-out', name: 'Eating out' },
  { id: 'transport', name: 'Transport' },
  { id: 'housing', name: 'Housing' },
  { id: 'shopping', name: 'Shopping' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'income', name: 'Income' },
];

/** For each everyday category: some shops, and the smallest and largest spend in cents. */
const everydaySpending = [
  { categoryId: 'groceries', merchants: ['Mercadona', 'Carrefour', 'Lidl'], min: 1500, max: 9000 },
  { categoryId: 'eating-out', merchants: ['Starbucks', 'Bar Manolo'], min: 400, max: 4500 },
  { categoryId: 'transport', merchants: ['Metro de Madrid', 'Cabify'], min: 150, max: 6000 },
  { categoryId: 'shopping', merchants: ['Zara', 'Amazon', 'Decathlon'], min: 1200, max: 12000 },
  { categoryId: 'entertainment', merchants: ['Netflix', 'Spotify'], min: 800, max: 2500 },
];

// --- Generated transactions ---

const ONE_DAY = 24 * 60 * 60 * 1000;

function createTransactions(): Transaction[] {
  const list: Transaction[] = [];

  // 140 everyday spends over the last 90 days.
  for (let i = 0; i < 140; i++) {
    const kind = randomItem(everydaySpending);
    const daysAgo = randomBetween(0, 90);

    // About one in eight has no category, so the app has something to categorise.
    let categoryId: string | null = kind.categoryId;
    if (random() < 0.125) {
      categoryId = null;
    }

    list.push({
      id: `tx-${String(i).padStart(3, '0')}`,
      accountId: randomItem(['acc-main', 'acc-main', 'acc-card']),
      merchant: randomItem(kind.merchants),
      amount: euros(-randomBetween(kind.min, kind.max)),
      date: new Date(NEWEST.getTime() - daysAgo * ONE_DAY).toISOString(),
      categoryId,
    });
  }

  // Salary in and rent out, on the 1st of each of the last three months.
  for (let monthsAgo = 0; monthsAgo < 3; monthsAgo++) {
    const firstOfMonth = new Date(
      Date.UTC(NEWEST.getUTCFullYear(), NEWEST.getUTCMonth() - monthsAgo, 1, 9),
    );
    const date = firstOfMonth.toISOString();
    const month = date.slice(0, 7); // "2026-09"

    list.push({
      id: `salary-${month}`,
      accountId: 'acc-main',
      merchant: 'Acme Corp',
      amount: euros(285000),
      date,
      categoryId: 'income',
    });
    list.push({
      id: `rent-${month}`,
      accountId: 'acc-main',
      merchant: 'Rent',
      amount: euros(-95000),
      date,
      categoryId: 'housing',
    });
  }

  // Newest first. ISO dates sort correctly as text.
  list.sort((a, b) => b.date.localeCompare(a.date));
  return list;
}

export const transactions = createTransactions();

// --- Budgets ---

/** Monthly limit per category, in cents. */
const monthlyLimits = [
  { categoryId: 'groceries', limit: 40000 },
  { categoryId: 'eating-out', limit: 15000 },
  { categoryId: 'transport', limit: 10000 },
  { categoryId: 'shopping', limit: 20000 },
  { categoryId: 'entertainment', limit: 5000 },
  { categoryId: 'housing', limit: 95000 },
];

/** This month's budgets. "Spent" adds up that category's spends this month. */
export function budgets(): Budget[] {
  const month = NEWEST.toISOString().slice(0, 7);
  const result: Budget[] = [];

  for (const { categoryId, limit } of monthlyLimits) {
    let spent = 0;
    for (const t of transactions) {
      const isThisCategory = t.categoryId === categoryId;
      const isThisMonth = t.date.startsWith(month);
      const isSpend = t.amount.amount < 0;
      if (isThisCategory && isThisMonth && isSpend) {
        spent += -t.amount.amount;
      }
    }
    result.push({ categoryId, month, limit: euros(limit), spent: euros(spent) });
  }

  return result;
}
