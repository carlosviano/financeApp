/**
 * Semantic tokens: what a value is for, never what it looks like (C7). Colours
 * here must be primitive references (C3). Only the component layer may import
 * this file (C1).
 */
import type { TextStyle } from 'react-native';

import { fontFamily, palette, radius, shadow, space, type PrimitiveColour } from './primitives';

declare const semantic: unique symbol;

/** A colour from a semantic role. A primitive or a plain string is not one (C4). */
export type SemanticColour = string & { readonly [semantic]: true };

/** The roles every theme fills. One shape for light and dark. */
export interface ColourRoles<C> {
  surface: { canvas: C; default: C; muted: C; sunken: C; transparent: C };
  /** `disabled` is exempt from contrast rules, as WCAG exempts inactive controls. */
  text: { primary: C; secondary: C; disabled: C; onAccent: C };
  border: { default: C; strong: C };
  accent: { default: C; strong: C; subtle: C };
  positive: { default: C; subtle: C };
  negative: { default: C; subtle: C };
  caution: { default: C; subtle: C };
  info: { default: C; subtle: C };
}

/** C8 — the typography scale holds at most eight variants. */
export type ScaleOfAtMostEight = readonly string[] & { length: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 };

export const typographyVariants = [
  'display',
  'title',
  'heading',
  'body',
  'label',
  'caption',
  'amount',
] as const satisfies ScaleOfAtMostEight;

export type TypographyVariant = (typeof typographyVariants)[number];

export interface SemanticTheme {
  colours: ColourRoles<SemanticColour>;
  space: { xs: number; sm: number; md: number; lg: number; xl: number; xxl: number };
  radius: { chip: number; control: number; card: number };
  elevation: { low: string; high: string };
  typography: Record<TypographyVariant, TextStyle>;
}

const lightColours: ColourRoles<PrimitiveColour> = {
  surface: {
    canvas: palette.sand[50],
    default: palette.white,
    muted: palette.sand[100],
    sunken: palette.sand[200],
    transparent: palette.transparent,
  },
  text: {
    primary: palette.slate[900],
    secondary: palette.slate[600],
    disabled: palette.slate[400],
    onAccent: palette.white,
  },
  border: { default: palette.sand[300], strong: palette.sand[400] },
  accent: {
    default: palette.indigo[700],
    strong: palette.indigo[800],
    subtle: palette.indigo[100],
  },
  positive: { default: palette.green[700], subtle: palette.green[100] },
  negative: { default: palette.orange[700], subtle: palette.orange[100] },
  caution: { default: palette.gold[600], subtle: palette.gold[100] },
  info: { default: palette.teal[700], subtle: palette.teal[100] },
};

const darkColours: ColourRoles<PrimitiveColour> = {
  surface: {
    canvas: palette.sand[900],
    default: palette.sand[800],
    muted: palette.sand[700],
    sunken: palette.sand[950],
    transparent: palette.transparent,
  },
  text: {
    primary: palette.slate[50],
    secondary: palette.slate[300],
    disabled: palette.slate[500],
    onAccent: palette.slate[900],
  },
  border: { default: palette.sand[600], strong: palette.sand[500] },
  accent: {
    default: palette.indigo[300],
    strong: palette.indigo[200],
    subtle: palette.indigo[950],
  },
  positive: { default: palette.green[400], subtle: palette.green[950] },
  negative: { default: palette.orange[400], subtle: palette.orange[950] },
  caution: { default: palette.gold[400], subtle: palette.gold[950] },
  info: { default: palette.teal[400], subtle: palette.teal[950] },
};

/** The one place a primitive colour becomes a semantic one. */
const asRoles = (colours: ColourRoles<PrimitiveColour>) =>
  colours as unknown as ColourRoles<SemanticColour>;

const typography: Record<TypographyVariant, TextStyle> = {
  display: { fontFamily: fontFamily.display, fontSize: 32, lineHeight: 38, fontWeight: '600' },
  title: { fontFamily: fontFamily.display, fontSize: 24, lineHeight: 30, fontWeight: '600' },
  heading: { fontFamily: fontFamily.body, fontSize: 18, lineHeight: 24, fontWeight: '600' },
  body: { fontFamily: fontFamily.body, fontSize: 16, lineHeight: 22, fontWeight: '400' },
  label: { fontFamily: fontFamily.body, fontSize: 15, lineHeight: 20, fontWeight: '600' },
  caption: { fontFamily: fontFamily.body, fontSize: 13, lineHeight: 18, fontWeight: '400' },
  amount: {
    fontFamily: fontFamily.display,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
};

const theme = (colours: ColourRoles<PrimitiveColour>): SemanticTheme => ({
  colours: asRoles(colours),
  space: { xs: space[1], sm: space[2], md: space[3], lg: space[4], xl: space[6], xxl: space[8] },
  radius: { chip: radius.sm, control: radius.md, card: radius.lg },
  elevation: { low: shadow.sm, high: shadow.lg },
  typography,
});

export const light = theme(lightColours);
export const dark = theme(darkColours);
