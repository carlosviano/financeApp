/**
 * Primitive tokens: raw values, named by appearance. This is the only module
 * allowed to contain colour literals (C2, C5). Colours are taken from the
 * design canvas as a guide. Only the semantic layer may import this file (C1).
 */

declare const primitive: unique symbol;

/** A colour from this palette. A plain string is not one (C3). */
export type PrimitiveColour = string & { readonly [primitive]: true };

type Branded<T> = {
  readonly [K in keyof T]: T[K] extends string ? PrimitiveColour : Branded<T[K]>;
};

const colours = {
  white: '#FFFFFF',
  transparent: 'transparent',
  sand: {
    50: '#F7F5F0',
    100: '#EFEBE2',
    200: '#EAE5D9',
    300: '#E6E1D5',
    400: '#D5CFC0',
  },
  slate: {
    400: '#9C9CA7',
    600: '#5C5D68',
    900: '#15161C',
  },
  indigo: { 100: '#E3EBFD', 700: '#224FC0', 800: '#1B3F9A' },
  teal: { 100: '#D2EFEC', 700: '#16827D' },
  gold: { 100: '#F6E6C7', 600: '#B67C0D' },
  green: { 100: '#D6EFDE', 700: '#007840' },
  orange: { 100: '#FFDFD2', 700: '#BB3F00' },
} as const;

export const palette = colours as Branded<typeof colours>;

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
