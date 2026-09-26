import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { t } from '@/shared/lib/i18n';
import { Button, Card, Text } from '@/shared/ui';

/**
 * Placeholder route until the MVP screens land. It shows the base components,
 * so they can be checked on a device in both themes.
 */
export default function Index() {
  return (
    <View style={styles.screen}>
      <Card>
        <Text variant="title">{t('app.name')}</Text>
        <Text tone="muted">{t('app.tagline')}</Text>
      </Card>
      <Button label={t('common.continue')} onPress={() => undefined} />
      <Button label={t('common.cancel')} onPress={() => undefined} variant="secondary" />
      <Button label={t('common.learnMore')} onPress={() => undefined} variant="tertiary" />
      <Button label={t('common.continue')} onPress={() => undefined} loading />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
    justifyContent: 'center',
    gap: theme.screen.gap,
    padding: theme.screen.padding,
    backgroundColor: theme.screen.background,
  },
}));
