import { Stack } from 'expo-router';

/**
 * Root layout. Deliberately bare in Phase 1 — the providers it will host
 * (theme, i18n) arrive with the tasks that build them, and the constitution
 * caps this file at five providers total.
 */
export default function RootLayout() {
  return <Stack />;
}
