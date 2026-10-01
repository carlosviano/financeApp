/**
 * The mock API (M1). It plays the role of a server: it receives a path like
 * `/transactions?cursor=tx-056` and returns a status code and a body, built
 * from the in-memory data in `data.ts`.
 */
import { API_URL } from '@/shared/config/constants';
import type { Transport } from '@/shared/lib/api';

import { accounts, budgets, categories, transactions } from './data';

export const PAGE_SIZE = 20;

/** Waits like a real network would: 150–500 ms on a device, 0 in tests. */
function delay(): Promise<void> {
  const isTest = process.env.NODE_ENV === 'test';
  const milliseconds = isTest ? 0 : 150 + Math.random() * 350;
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

/**
 * One page of transactions, newest first (M2).
 *
 * The cursor is the id of the last transaction the app already has. The page
 * starts right after it. When there is nothing after the page, `nextCursor`
 * is null, which tells the app it has reached the end.
 */
function getTransactionPage(cursor: string | null) {
  let start = 0;
  if (cursor !== null) {
    const index = transactions.findIndex((t) => t.id === cursor);
    if (index === -1) {
      // We never handed out that cursor.
      return { status: 400, body: null };
    }
    start = index + 1;
  }

  const items = transactions.slice(start, start + PAGE_SIZE);

  let nextCursor: string | null = null;
  const isLastPage = start + PAGE_SIZE >= transactions.length;
  const lastItem = items[items.length - 1];
  if (!isLastPage && lastItem) {
    nextCursor = lastItem.id;
  }

  return { status: 200, body: { items, nextCursor } };
}

function getTransaction(id: string) {
  const transaction = transactions.find((t) => t.id === id);
  if (!transaction) {
    return { status: 404, body: null };
  }
  return { status: 200, body: transaction };
}

export const mockTransport: Transport = async (path) => {
  await delay();

  // `new URL` splits "/transactions?cursor=tx-056" into a pathname
  // ("/transactions") and search params (cursor = "tx-056").
  const url = new URL(path, API_URL);
  const pathname = url.pathname;

  if (pathname === '/accounts') {
    return { status: 200, body: accounts };
  }
  if (pathname === '/categories') {
    return { status: 200, body: categories };
  }
  if (pathname === '/budgets') {
    return { status: 200, body: budgets() };
  }
  if (pathname === '/transactions') {
    return getTransactionPage(url.searchParams.get('cursor'));
  }
  if (pathname.startsWith('/transactions/')) {
    const id = decodeURIComponent(pathname.slice('/transactions/'.length));
    return getTransaction(id);
  }

  return { status: 404, body: null };
};
