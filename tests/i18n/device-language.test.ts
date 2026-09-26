/**
 * I4 — the app reads the device language at startup.
 */
import { language, t } from '../../src/shared/lib/i18n';

jest.mock('expo-localization', () => ({ getLocales: () => [{ languageCode: 'es' }] }));

describe('device language (I4)', () => {
  it('shows Spanish on a Spanish device', () => {
    expect(language).toBe('es');
    expect(t('app.tagline')).toBe('Todo tu dinero, en un solo sitio');
  });
});
