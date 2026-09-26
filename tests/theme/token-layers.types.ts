/**
 * C8 and D11 — checked by `pnpm typecheck`, not by Jest. Each
 * `@ts-expect-error` fails the build if the line below it stops being an error.
 */
import { palette } from '../../src/theme/primitives';
import type { ColourRoles, ScaleOfAtMostEight } from '../../src/theme/semantic';

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
export const missingRole: ColourRoles['info'] = { default: palette.teal[700] };
