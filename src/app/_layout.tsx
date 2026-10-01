import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useUnistyles } from 'react-native-unistyles';

import { queryClient } from '@/shared/lib/api';
import { t } from '@/shared/lib/i18n';

/** Root layout. The constitution caps it at five providers; this is the first. */
export default function RootLayout() {
  // React Navigation draws the header itself, so it can't read unistyles
  // styles. `useUnistyles` re-renders this layout when the theme changes.
  const { theme } = useUnistyles();

  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.navigation.background },
          headerTitleStyle: { color: theme.navigation.title },
          headerTintColor: theme.navigation.tint,
          contentStyle: { backgroundColor: theme.screen.background },
        }}
      >
        {/* The tabs draw their own headers. */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="transactions/[id]" options={{ title: t('transactions.detailTitle') }} />
      </Stack>
    </QueryClientProvider>
  );
}
