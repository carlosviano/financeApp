/**
 * C3, C4, C8 — checked by `pnpm typecheck`, not by Jest. Each
 * `@ts-expect-error` fails the build if the line below it stops being an error.
 */
import type { ComponentTokens } from '../../src/theme/components';
import { palette, type PrimitiveColour } from '../../src/theme/primitives';
import { light, type ColourRoles, type ScaleOfAtMostEight } from '../../src/theme/semantic';

type Role = ColourRoles<PrimitiveColour>['info'];
type ButtonColours = ComponentTokens['button']['primary'];

export const semanticFromPrimitive: Role = {
  default: palette.teal[700],
  subtle: palette.teal[100],
};

export const semanticFromLiteral: Role = {
  // @ts-expect-error C3: a literal is not a primitive colour
  default: '#16827D',
  subtle: palette.teal[100],
};

export const componentFromSemantic: ButtonColours = {
  background: light.colours.accent.default,
  backgroundPressed: light.colours.accent.strong,
  border: light.colours.accent.default,
  label: light.colours.text.onAccent,
};

export const componentFromPrimitive: ButtonColours = {
  // @ts-expect-error C4: a primitive skips the semantic layer
  background: palette.indigo[700],
  backgroundPressed: light.colours.accent.strong,
  border: light.colours.accent.default,
  label: light.colours.text.onAccent,
};

export const componentFromLiteral: ButtonColours = {
  // @ts-expect-error C4: a literal is not a semantic colour
  background: '#224FC0',
  backgroundPressed: light.colours.accent.strong,
  border: light.colours.accent.default,
  label: light.colours.text.onAccent,
};

export const eightVariants: ScaleOfAtMostEight = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;

// @ts-expect-error C8: a ninth variant does not fit the scale
export const nineVariants: ScaleOfAtMostEight = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
] as const;

// @ts-expect-error D11: every theme fills every role
export const missingRole: Role = { default: palette.teal[700] };
