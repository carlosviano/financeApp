import { useQuery } from '@tanstack/react-query';

import { getJson } from '@/shared/lib/api';

import type { Account } from '../model/types';
import { accountKeys } from './keys';

/** Makes the request and returns the accounts. */
export function getAccounts(): Promise<Account[]> {
  return getJson<Account[]>('/accounts');
}

/**
 * For screens. Returns `{ data, isPending, isError, refetch, … }`, and TanStack
 * Query handles loading, caching and refetching.
 */
export function useAccounts() {
  return useQuery({
    queryKey: accountKeys.list(),
    queryFn: getAccounts,
  });
}
