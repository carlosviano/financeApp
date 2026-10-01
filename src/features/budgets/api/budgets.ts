import { useQuery } from '@tanstack/react-query';

import { getJson } from '@/shared/lib/api';

import type { Budget } from '../model/types';
import { budgetKeys } from './keys';

export function getBudgets(): Promise<Budget[]> {
  return getJson<Budget[]>('/budgets');
}

export function useBudgets() {
  return useQuery({
    queryKey: budgetKeys.list(),
    queryFn: getBudgets,
  });
}
