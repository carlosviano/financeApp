import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { getJson } from '@/shared/lib/api';

import type { Category, Transaction, TransactionPage } from '../model/types';
import { categoryKeys, transactionKeys } from './keys';

// --- Plain functions: each one makes one request and returns the data. ---

export function getTransactionPage(cursor: string | null): Promise<TransactionPage> {
  if (cursor === null) {
    return getJson<TransactionPage>('/transactions');
  }
  return getJson<TransactionPage>(`/transactions?cursor=${encodeURIComponent(cursor)}`);
}

export function getTransaction(id: string): Promise<Transaction> {
  return getJson<Transaction>(`/transactions/${encodeURIComponent(id)}`);
}

export function getCategories(): Promise<Category[]> {
  return getJson<Category[]>('/categories');
}

// --- Hooks: screens use these. TanStack Query calls the functions above,
// --- caches the result under the key, and tracks loading and errors.

/** All transactions, one page at a time. `fetchNextPage()` loads the next one. */
export function useTransactions() {
  return useInfiniteQuery({
    queryKey: transactionKeys.list(),
    // The first page has no cursor.
    initialPageParam: null as string | null,
    // `pageParam` is the cursor: null for the first page, then whatever
    // getNextPageParam returned.
    queryFn: ({ pageParam }) => getTransactionPage(pageParam),
    // Returning null tells TanStack Query there are no more pages.
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: () => getTransaction(id),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: getCategories,
  });
}
