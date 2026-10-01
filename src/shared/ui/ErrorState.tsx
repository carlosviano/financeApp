import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { t } from '@/shared/lib/i18n';

import { Button } from './Button';
import { Text } from './Text';

interface ErrorStateProps {
  onRetry: () => void;
}

/** Full-screen error with a retry action (Q2). */
export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text variant="heading">{t('common.errorTitle')}</Text>
      <Text tone="muted">{t('common.errorBody')}</Text>
      <Button label={t('common.retry')} onPress={onRetry} variant="secondary" />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.screen.gap,
    padding: theme.screen.padding,
  },
}));
