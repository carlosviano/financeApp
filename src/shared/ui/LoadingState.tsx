import { ActivityIndicator, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { t } from '@/shared/lib/i18n';

/** Full-screen spinner while a screen's first request is in flight (Q1). */
export function LoadingState() {
  // ActivityIndicator takes a colour prop, not a style, so read the theme here.
  const { theme } = useUnistyles();

  return (
    <View style={styles.container}>
      <ActivityIndicator
        color={theme.text.tones.muted}
        accessibilityLabel={t('common.loading')}
        size="large"
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.screen.padding,
  },
}));
