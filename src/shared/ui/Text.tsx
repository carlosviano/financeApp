import type { ReactNode } from 'react';
import { Text as NativeText } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import type { ComponentTokens, TypographyVariant } from '@/theme';

export type TextTone = keyof ComponentTokens['text']['tones'];

interface TextProps {
  children: ReactNode;
  variant?: TypographyVariant;
  tone?: TextTone;
  numberOfLines?: number;
}

export function Text({ children, variant = 'body', tone = 'default', numberOfLines }: TextProps) {
  return (
    <NativeText style={styles.text(variant, tone)} numberOfLines={numberOfLines}>
      {children}
    </NativeText>
  );
}

const styles = StyleSheet.create((theme) => ({
  text: (variant: TypographyVariant, tone: TextTone) => ({
    ...theme.text.variants[variant],
    color: theme.text.tones[tone],
  }),
}));
