/** English, the default language. Its keys are the only valid keys for `t()`. */
export const en = {
  'app.name': 'financeApp',
  'app.tagline': 'All your money, in one place',
  'common.continue': 'Continue',
  'common.cancel': 'Cancel',
  'common.learnMore': 'Learn more',
  'common.comingSoon': 'Coming soon',
  'common.loading': 'Loading',
  'common.errorTitle': 'Something went wrong',
  'common.errorBody': 'Check your connection and try again.',
  'common.retry': 'Try again',
  'accounts.totalBalance': 'Total balance',
  'accounts.empty': 'You have no accounts yet.',
  'tabs.home': 'Home',
  'tabs.transactions': 'Transactions',
  'tabs.budgets': 'Budgets',
  'tabs.settings': 'Settings',
  'transactions.detailTitle': 'Transaction',
  'transactions.empty': 'No transactions yet.',
  'transactions.loadMoreFailed': "Couldn't load more transactions.",
} as const;

export type TranslationKey = keyof typeof en;
