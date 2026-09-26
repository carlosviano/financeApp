/**
 * @jest-environment node
 *
 * I4 — Spanish on a Spanish device, English otherwise.
 */
import { resolveLanguage, translate } from '../../src/shared/lib/i18n/translate';

describe('resolveLanguage', () => {
  it('picks Spanish for a Spanish device', () => {
    expect(resolveLanguage('es')).toBe('es');
  });

  it.each(['en', 'fr', 'pt', null, undefined])('falls back to English for %p', (code) => {
    expect(resolveLanguage(code)).toBe('en');
  });
});

describe('translate', () => {
  it('reads the catalogue for the language', () => {
    expect(translate('en', 'app.name')).toBe('financeApp');
    expect(translate('es', 'app.name')).toBe('financeApp');
  });
});
