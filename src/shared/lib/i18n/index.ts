import { getLocales } from 'expo-localization';

import type { TranslationKey } from './en';
import { resolveLanguage, translate } from './translate';

/** Read once at startup: iOS restarts the app when the language changes. */
export const language = resolveLanguage(getLocales()[0].languageCode);

export const t = (key: TranslationKey) => translate(language, key);

export type { TranslationKey };
