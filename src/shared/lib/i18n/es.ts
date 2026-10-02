import type { TranslationKey } from './en';

/** Spanish. Typed against the English keys, so a missing key fails typecheck. */
export const es: Record<TranslationKey, string> = {
  'app.name': 'financeApp',
  'app.tagline': 'Todo tu dinero, en un solo sitio',
  'common.continue': 'Continuar',
  'common.cancel': 'Cancelar',
  'common.learnMore': 'Saber más',
  'common.comingSoon': 'Próximamente',
  'common.loading': 'Cargando',
  'common.errorTitle': 'Algo ha ido mal',
  'common.errorBody': 'Revisa tu conexión y vuelve a intentarlo.',
  'common.retry': 'Reintentar',
  'accounts.totalBalance': 'Saldo total',
  'accounts.empty': 'Todavía no tienes cuentas.',
  'tabs.home': 'Inicio',
  'tabs.transactions': 'Movimientos',
  'tabs.budgets': 'Presupuestos',
  'tabs.settings': 'Ajustes',
  'transactions.detailTitle': 'Movimiento',
  'transactions.empty': 'Todavía no hay movimientos.',
  'transactions.loadMoreFailed': 'No se han podido cargar más movimientos.',
};
