import type { ReactNode } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface CardProps {
  children: ReactNode;
}

export function Card({ children }: CardProps) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.card.background,
    borderColor: theme.card.border,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: theme.card.radius,
    padding: theme.card.padding,
    boxShadow: theme.card.shadow,
  },
}));
