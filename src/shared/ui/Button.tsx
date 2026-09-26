import { ActivityIndicator, Pressable, Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

interface ButtonProps {
  /** Already translated: pass `t('…')`. */
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
}: ButtonProps) {
  // A loading button is also disabled: it can't be pressed twice (U2, U3).
  const inactive = disabled || loading;
  const colours = inactive ? 'disabled' : variant;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={({ pressed }) => styles.container(colours, pressed)}
    >
      {loading ? <ActivityIndicator color={styles.label(colours).color} /> : null}
      <Text style={styles.label(colours)}>{label}</Text>
    </Pressable>
  );
}

type Colours = ButtonVariant | 'disabled';

const styles = StyleSheet.create((theme) => ({
  container: (colours: Colours, pressed: boolean) => {
    const tokens = theme.button[colours];
    const background =
      pressed && 'backgroundPressed' in tokens ? tokens.backgroundPressed : tokens.background;
    return {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.button.gap,
      minHeight: theme.button.minHeight,
      paddingHorizontal: theme.button.paddingHorizontal,
      paddingVertical: theme.button.paddingVertical,
      borderRadius: theme.button.radius,
      borderWidth: 1,
      borderColor: tokens.border,
      backgroundColor: background,
    };
  },
  label: (colours: Colours) => ({
    ...theme.button.label,
    color: theme.button[colours].label,
  }),
}));
