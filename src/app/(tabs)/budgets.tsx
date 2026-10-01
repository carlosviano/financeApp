import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { t } from '@/shared/lib/i18n';
import { Text } from '@/shared/ui';

/** Placeholder until the budgets screen lands. */
export default function BudgetsTab() {
  return (
    <View style={styles.screen}>
      <Text tone="muted">{t('common.comingSoon')}</Text>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.screen.padding,
  },
}));
