import type { Money } from '@/shared/lib/money';

export interface Account {
  id: string;
  name: string;
  kind: 'checking' | 'savings' | 'credit';
  balance: Money;
}
