/**
 * Values that are genuinely global and owned by no single feature.
 *
 * `src/shared/**` may not import from `src/features/**` (criterion B2). If
 * something here needs to know about a feature, it belongs in that feature.
 */
export const APP_NAME = 'financeApp';
