/**
 * Primitive tokens: raw values, named by appearance. This is the only module
 * allowed to contain colour literals (C2, C5). Colours are taken from the
 * design canvas as a guide; the dark shades are picked by hand. By convention
 * only the semantic layer imports this file.
 */

export const palette = {
  white: '#FFFFFF',
  transparent: 'transparent',
  sand: {
    50: '#F7F5F0',
    100: '#EFEBE2',
    200: '#EAE5D9',
    300: '#E6E1D5',
    400: '#D5CFC0',
    500: '#4B463B',
    600: '#38342C',
    700: '#2A2721',
    800: '#1F1D18',
    900: '#161511',
    950: '#0E0D0B',
  },
  slate: {
    50: '#EDEEF1',
    300: '#A9AAB5',
    400: '#9C9CA7',
    500: '#6E6F7A',
    600: '#5C5D68',
    900: '#15161C',
  },
  indigo: {
    100: '#E3EBFD',
    200: '#B3C4F5',
    300: '#8FA8F0',
    700: '#224FC0',
    800: '#1B3F9A',
    950: '#1A2440',
  },
  teal: { 100: '#D2EFEC', 400: '#4FC4BC', 700: '#16827D', 950: '#0E2A28' },
  gold: { 100: '#F6E6C7', 400: '#E0B04A', 600: '#B67C0D', 950: '#2E2310' },
  green: { 100: '#D6EFDE', 400: '#4CC38A', 700: '#007840', 950: '#0F2A1C' },
  orange: { 100: '#FFDFD2', 400: '#FF8A5C', 700: '#BB3F00', 950: '#33170C' },
} as const;

export const space = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  6: 24,
  8: 32,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 22,
} as const;

// CSS strings, as accepted by the `boxShadow` style prop.
export const shadow = {
  sm: '0 1px 2px rgba(21,22,28,.05)',
  lg: '0 16px 32px -12px rgba(21,22,28,.18)',
} as const;

export const fontFamily = {
  display: 'Space Grotesk',
  body: 'Public Sans',
} as const;
