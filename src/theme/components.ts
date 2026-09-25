/**
 * Component tokens: the values each base component renders. Colours here must
 * be semantic references (C4). This is the layer the rest of the app reads,
 * through `src/theme/index.ts`.
 */
import type { TextStyle } from 'react-native';

import { dark, light, type SemanticColour, type SemanticTheme } from './semantic';

interface ButtonColours {
  background: SemanticColour;
  backgroundPressed: SemanticColour;
  border: SemanticColour;
  label: SemanticColour;
}

export interface ComponentTokens {
  button: {
    primary: ButtonColours;
    secondary: ButtonColours;
    tertiary: ButtonColours;
    disabled: Omit<ButtonColours, 'backgroundPressed'>;
    radius: number;
    paddingHorizontal: number;
    paddingVertical: number;
    label: TextStyle;
  };
}

const componentTokens = ({
  colours,
  space,
  radius,
  typography,
}: SemanticTheme): ComponentTokens => ({
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
    label: typography.label,
  },
});

export const themes = {
  light: componentTokens(light),
  dark: componentTokens(dark),
};
