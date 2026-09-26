/**
 * I2 and I3 — checked by `pnpm typecheck`, not by Jest. Each
 * `@ts-expect-error` fails the build if the line below it stops being an error.
 */
import type { TranslationKey } from '../../src/shared/lib/i18n/en';
import { translate } from '../../src/shared/lib/i18n/translate';

export const known = translate('en', 'app.name');

// @ts-expect-error I2: a key missing from the English catalogue
export const unknown = translate('en', 'home.nothing');

// @ts-expect-error I3: the Spanish catalogue must have every English key
export const incomplete: Record<TranslationKey, string> = {};
