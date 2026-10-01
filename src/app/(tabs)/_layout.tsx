import { Tabs } from 'expo-router';
import { useUnistyles } from 'react-native-unistyles';

import { t } from '@/shared/lib/i18n';

/** The four tabs (N1). Labels only for now; icons are a later decision. */
export default function TabsLayout() {
  const { theme } = useUnistyles();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: theme.navigation.background },
        headerTitleStyle: { color: theme.navigation.title },
        tabBarStyle: {
          backgroundColor: theme.navigation.background,
          borderTopColor: theme.navigation.border,
        },
        tabBarActiveTintColor: theme.navigation.tabActive,
        tabBarInactiveTintColor: theme.navigation.tabInactive,
        // Without an icon the label sits low; this centres it in the bar.
        tabBarIconStyle: { display: 'none' },
        sceneStyle: { backgroundColor: theme.screen.background },
      }}
    >
      <Tabs.Screen name="index" options={{ title: t('tabs.home') }} />
      <Tabs.Screen name="transactions" options={{ title: t('tabs.transactions') }} />
      <Tabs.Screen name="budgets" options={{ title: t('tabs.budgets') }} />
      <Tabs.Screen name="settings" options={{ title: t('tabs.settings') }} />
    </Tabs>
  );
}
