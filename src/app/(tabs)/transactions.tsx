import { router } from 'expo-router';

import { TransactionList } from '@/features/transactions';

export default function TransactionsTab() {
  const openDetail = (id: string) => {
    router.push(`/transactions/${id}`);
  };

  return <TransactionList onPressTransaction={openDetail} />;
}
