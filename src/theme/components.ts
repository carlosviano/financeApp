/**
 * Component tokens: the values each base component renders. Colours here come
 * from semantic roles, never straight from the palette. This is the layer the rest of the app reads,
 * through `src/theme/index.ts`.
 */
import {
  dark,
  light,
  type SemanticTheme,
  type TypeStyle,
  type TypographyVariant,
} from './semantic';

interface ButtonColours {
  background: string;
  backgroundPressed: string;
  border: string;
  label: string;
}

export interface ComponentTokens {
  screen: { background: string; foreground: string; padding: number; gap: number };
  /** The header and tab bar, which React Navigation draws rather than unistyles. */
  navigation: {
    background: string;
    border: string;
    title: string;
    tint: string;
    tabActive: string;
    tabInactive: string;
  };
  text: {
    variants: Record<TypographyVariant, TypeStyle>;
    tones: {
      default: string;
      muted: string;
      accent: string;
      positive: string;
      negative: string;
      onAccent: string;
    };
  };
  card: { background: string; border: string; radius: number; padding: number; shadow: string };
  listRow: {
    background: string;
    backgroundPressed: string;
    divider: string;
    paddingVertical: number;
  };
  button: {
    primary: ButtonColours;
    secondary: ButtonColours;
    tertiary: ButtonColours;
    disabled: Omit<ButtonColours, 'backgroundPressed'>;
    radius: number;
    paddingHorizontal: number;
    paddingVertical: number;
    minHeight: number;
    gap: number;
    label: TypeStyle;
  };
}

const componentTokens = ({
  colours,
  space,
  radius,
  typography,
  elevation,
}: SemanticTheme): ComponentTokens => ({
  screen: {
    background: colours.surface.canvas,
    foreground: colours.text.primary,
    padding: space.lg,
    gap: space.md,
  },
  navigation: {
    background: colours.surface.default,
    border: colours.border.default,
    title: colours.text.primary,
    tint: colours.accent.default,
    tabActive: colours.accent.default,
    tabInactive: colours.text.secondary,
  },
  text: {
    variants: typography,
    tones: {
      default: colours.text.primary,
      muted: colours.text.secondary,
      accent: colours.accent.default,
      positive: colours.positive.default,
      negative: colours.negative.default,
      onAccent: colours.text.onAccent,
    },
  },
  card: {
    background: colours.surface.default,
    border: colours.border.default,
    radius: radius.card,
    padding: space.lg,
    shadow: elevation.low,
  },
  listRow: {
    background: colours.surface.default,
    backgroundPressed: colours.surface.sunken,
    divider: colours.border.default,
    paddingVertical: space.md,
  },
  button: {
    primary: {
      background: colours.accent.default,
      backgroundPressed: colours.accent.strong,
      border: colours.accent.default,
      label: colours.text.onAccent,
    },
    secondary: {
      background: colours.surface.default,
      backgroundPressed: colours.surface.sunken,
      border: colours.border.strong,
      label: colours.text.primary,
    },
    tertiary: {
      background: colours.surface.transparent,
      backgroundPressed: colours.accent.subtle,
      border: colours.surface.transparent,
      label: colours.accent.default,
    },
    disabled: {
      background: colours.surface.muted,
      border: colours.surface.muted,
      label: colours.text.disabled,
    },
    radius: radius.control,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    // 44pt is Apple's minimum comfortable touch target.
    minHeight: 44,
    gap: space.sm,
    label: typography.label,
  },
});

export const themes = {
  light: componentTokens(light),
  dark: componentTokens(dark),
};
