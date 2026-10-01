import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { useTransaction } from '@/features/transactions';
import { locale } from '@/shared/lib/i18n';
import { formatMoney } from '@/shared/lib/money';
import { Text } from '@/shared/ui';

/** Transaction detail (N2). Task 8 adds the full fields and categorisation. */
export default function TransactionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: transaction } = useTransaction(id);

  if (!transaction) {
    return null;
  }

  return (
    <View style={styles.screen}>
      <Text variant="title">{transaction.merchant}</Text>
      <Text variant="amount">{formatMoney(transaction.amount, locale)}</Text>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: {
    gap: theme.screen.gap,
    padding: theme.screen.padding,
  },
}));
