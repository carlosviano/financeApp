/**
 * Theme runtime. Registers the component-token themes with unistyles and
 * starts in `system` mode, following the OS colour scheme live (T2).
 */
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';

import { themes, type ComponentTokens } from './components';

declare module 'react-native-unistyles' {
  export interface UnistylesThemes {
    light: ComponentTokens;
    dark: ComponentTokens;
  }
}

export const unistylesConfig = { themes, settings: { adaptiveThemes: true } } as const;

StyleSheet.configure(unistylesConfig);

export const themeModes = ['light', 'dark', 'system'] as const;
export type ThemeMode = (typeof themeModes)[number];

/** `system` follows the OS; `light` and `dark` pin the theme (T1). */
export const setThemeMode = (mode: ThemeMode) => {
  if (mode === 'system') {
    UnistylesRuntime.setAdaptiveThemes(true);
    return;
  }
  UnistylesRuntime.setAdaptiveThemes(false);
  UnistylesRuntime.setTheme(mode);
};
