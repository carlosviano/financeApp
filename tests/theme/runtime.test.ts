/**
 * T1 and T2 against the unistyles mocks. The live OS switch itself happens in
 * native code, so it is checked on a device; this covers our side of it.
 */
import { UnistylesRuntime } from 'react-native-unistyles';

import { setThemeMode, themes } from '../../src/theme';
import { unistylesConfig } from '../../src/theme/runtime';

describe('theme runtime', () => {
  it('registers both themes and starts following the OS (T2)', () => {
    expect(unistylesConfig).toEqual({ themes, settings: { adaptiveThemes: true } });
  });

  it.each(['light', 'dark'] as const)('pins the %s theme (T1)', (mode) => {
    const adaptive = jest.spyOn(UnistylesRuntime, 'setAdaptiveThemes');
    const setTheme = jest.spyOn(UnistylesRuntime, 'setTheme');
    setThemeMode(mode);
    expect(adaptive).toHaveBeenLastCalledWith(false);
    expect(setTheme).toHaveBeenLastCalledWith(mode);
  });

  it('goes back to following the OS in system mode (T1)', () => {
    const adaptive = jest.spyOn(UnistylesRuntime, 'setAdaptiveThemes');
    const setTheme = jest.spyOn(UnistylesRuntime, 'setTheme').mockClear();
    setThemeMode('system');
    expect(adaptive).toHaveBeenLastCalledWith(true);
    expect(setTheme).not.toHaveBeenCalled();
  });
});
