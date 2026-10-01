import type { TranslationKey } from './en';

/** Spanish. Typed against the English keys, so a missing key fails typecheck. */
export const es: Record<TranslationKey, string> = {
  'app.name': 'financeApp',
  'app.tagline': 'Todo tu dinero, en un solo sitio',
  'common.continue': 'Continuar',
  'common.cancel': 'Cancelar',
  'common.learnMore': 'Saber más',
  'common.comingSoon': 'Próximamente',
  'tabs.home': 'Inicio',
  'tabs.transactions': 'Movimientos',
  'tabs.budgets': 'Presupuestos',
  'tabs.settings': 'Ajustes',
  'transactions.detailTitle': 'Movimiento',
};
