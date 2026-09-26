/** English, the default language. Its keys are the only valid keys for `t()`. */
export const en = {
  'app.name': 'financeApp',
  'app.tagline': 'All your money, in one place',
  'common.continue': 'Continue',
  'common.cancel': 'Cancel',
  'common.learnMore': 'Learn more',
} as const;

export type TranslationKey = keyof typeof en;
