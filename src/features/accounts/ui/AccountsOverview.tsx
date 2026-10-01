import { ScrollView, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { locale, t } from '@/shared/lib/i18n';
import { formatMoney } from '@/shared/lib/money';
import { Card, ErrorState, LoadingState, Text } from '@/shared/ui';

import { useAccounts } from '../api/accounts';
import { getTotalBalance } from '../model/totalBalance';

/** Home: the total balance and one row per account (H1, Q1, Q2). */
export function AccountsOverview() {
  const { data: accounts, isPending, isError, refetch } = useAccounts();

  if (isPending) {
    return <LoadingState />;
  }

  if (isError) {
    const retry = () => {
      void refetch();
    };
    return <ErrorState onRetry={retry} />;
  }

  // The request worked but there is nothing to list. Different from loading.
  if (accounts.length === 0) {
    return (
      <View style={styles.empty}>
        <Text tone="muted">{t('accounts.empty')}</Text>
      </View>
    );
  }

  const total = getTotalBalance(accounts);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {total ? (
        <Card>
          <Text tone="muted">{t('accounts.totalBalance')}</Text>
          <Text variant="amount">{formatMoney(total, locale)}</Text>
        </Card>
      ) : null}

      {accounts.map((account) => (
        <Card key={account.id}>
          <View style={styles.row}>
            <Text variant="label">{account.name}</Text>
            <Text tone={account.balance.amount < 0 ? 'negative' : 'default'}>
              {formatMoney(account.balance, locale)}
            </Text>
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  content: {
    gap: theme.screen.gap,
    padding: theme.screen.padding,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.screen.padding,
  },
}));
