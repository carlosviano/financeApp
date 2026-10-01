import { FlatList, Pressable } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { locale } from '@/shared/lib/i18n';
import { formatMoney } from '@/shared/lib/money';
import { Card, Text } from '@/shared/ui';

import { useTransactions } from '../api/transactions';

interface TransactionListProps {
  onPressTransaction: (id: string) => void;
}

/**
 * The first page of transactions, each row tappable (N2). A stand-in until
 * the paginated, grouped feed lands in task 7.
 */
export function TransactionList({ onPressTransaction }: TransactionListProps) {
  const { data } = useTransactions();
  const firstPage = data?.pages[0]?.items ?? [];

  return (
    <FlatList
      data={firstPage}
      keyExtractor={(transaction) => transaction.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            onPressTransaction(item.id);
          }}
        >
          <Card>
            <Text variant="label">{item.merchant}</Text>
            <Text tone="muted">{formatMoney(item.amount, locale)}</Text>
          </Card>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create((theme) => ({
  list: {
    gap: theme.screen.gap,
    padding: theme.screen.padding,
  },
}));
