import { ActivityIndicator, Pressable, SectionList, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { formatDay } from '@/shared/lib/dates';
import { locale, t, timeZone } from '@/shared/lib/i18n';
import { formatMoney } from '@/shared/lib/money';
import { Button, ErrorState, LoadingState, Text } from '@/shared/ui';

import { useTransactions } from '../api/transactions';
import { groupByDay } from '../model/groupByDay';
import type { Transaction } from '../model/types';

interface TransactionListProps {
  onPressTransaction: (id: string) => void;
}

/** Every transaction, newest first, grouped by day, loaded a page at a time (X1–X3). */
export function TransactionList({ onPressTransaction }: TransactionListProps) {
  const { theme } = useUnistyles();
  const {
    data,
    isPending,
    isLoadingError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useTransactions();

  if (isPending) {
    return <LoadingState />;
  }

  // The first page failed, so there is nothing to show yet (Q2).
  if (isLoadingError) {
    const retry = () => {
      void refetch();
    };
    return <ErrorState onRetry={retry} />;
  }

  const transactions = data.pages.flatMap((page) => page.items);
  if (transactions.length === 0) {
    return (
      <View style={styles.empty}>
        <Text tone="muted">{t('transactions.empty')}</Text>
      </View>
    );
  }

  const sections = groupByDay(transactions, timeZone);

  // `cancelRefetch: false` makes TanStack Query ignore the call while a page
  // is already on its way. Its default cancels that request and asks for the
  // same page again, and onEndReached often fires twice in a row.
  const loadNextPage = () => {
    void fetchNextPage({ cancelRefetch: false });
  };

  // Near the end of the list, ask for the next page (X2). After a failure,
  // wait for the retry button instead of trying again on every scroll (X3).
  // No `isFetchingNextPage` check here: this function can run before React
  // re-renders, so it would read an old value. `cancelRefetch` reads the live one.
  const onEndReached = () => {
    if (hasNextPage && !isFetchNextPageError) {
      loadNextPage();
    }
  };

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator
            color={theme.text.tones.muted}
            accessibilityLabel={t('common.loading')}
          />
        </View>
      );
    }
    if (isFetchNextPageError) {
      // The pages already loaded stay on screen; only the next one failed.
      return (
        <View style={styles.footer}>
          <Text tone="muted">{t('transactions.loadMoreFailed')}</Text>
          <Button label={t('common.retry')} onPress={loadNextPage} variant="secondary" />
        </View>
      );
    }
    return null;
  };

  return (
    <SectionList
      testID="transaction-list"
      sections={sections}
      keyExtractor={(transaction) => transaction.id}
      renderSectionHeader={({ section }) => (
        <View style={styles.header}>
          <Text variant="caption" tone="muted">
            {formatDay(section.day, locale)}
          </Text>
        </View>
      )}
      renderItem={({ item }) => <TransactionRow transaction={item} onPress={onPressTransaction} />}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      contentContainerStyle={styles.content}
      stickySectionHeadersEnabled
    />
  );
}

interface TransactionRowProps {
  transaction: Transaction;
  onPress: (id: string) => void;
}

function TransactionRow({ transaction, onPress }: TransactionRowProps) {
  const isIncome = transaction.amount.amount > 0;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => {
        onPress(transaction.id);
      }}
      style={({ pressed }) => styles.row(pressed)}
    >
      <Text numberOfLines={1}>{transaction.merchant}</Text>
      <Text tone={isIncome ? 'positive' : 'default'}>
        {formatMoney(transaction.amount, locale)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  content: {
    paddingBottom: theme.screen.padding,
  },
  header: {
    paddingHorizontal: theme.screen.padding,
    paddingTop: theme.screen.padding,
    paddingBottom: theme.screen.gap,
    backgroundColor: theme.screen.background,
  },
  row: (pressed: boolean) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.screen.gap,
    paddingHorizontal: theme.screen.padding,
    paddingVertical: theme.listRow.paddingVertical,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.listRow.divider,
    backgroundColor: pressed ? theme.listRow.backgroundPressed : theme.listRow.background,
  }),
  footer: {
    alignItems: 'center',
    gap: theme.screen.gap,
    padding: theme.screen.padding,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.screen.padding,
  },
}));
