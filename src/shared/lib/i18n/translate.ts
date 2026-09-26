import { en, type TranslationKey } from './en';
import { es } from './es';

const catalogues = { en, es };

export type Language = keyof typeof catalogues;

/** Spanish for any Spanish locale (`es`, `es-MX`, …); English for everything else. */
export const resolveLanguage = (languageCode: string | null | undefined): Language =>
  languageCode === 'es' ? 'es' : 'en';

export const translate = (language: Language, key: TranslationKey): string =>
  catalogues[language][key];
