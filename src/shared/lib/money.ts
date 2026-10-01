/** Money is an integer number of minor units (cents), never a float (constitution §8). */
export interface Money {
  amount: number;
  currency: string;
}

/** Formats at the UI edge only (M4). Assumes a two-decimal currency, like EUR. */
export const formatMoney = ({ amount, currency }: Money, locale: string): string =>
  new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount / 100);
