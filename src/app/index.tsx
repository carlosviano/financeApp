import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

/**
 * Placeholder route until the MVP screens land. It follows the theme, so the
 * runtime can be checked on a device by switching the OS appearance.
 */
export default function Index() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>financeApp</Text>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.screen.background,
  },
  title: { color: theme.screen.foreground },
}));
