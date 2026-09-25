/**
 * @jest-environment node
 *
 * D12 — text and the surface behind it reach WCAG AA (4.5:1) in both themes.
 */
import { themes } from '../../src/theme';
import { dark, light } from '../../src/theme/semantic';

/** WCAG 2 contrast ratio. */
const contrast = (a: string, b: string) => {
  const luminance = (hex: string) => {
    const [r = 0, g = 0, bl = 0] = [1, 3, 5].map((i) => {
      const c = parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return ((high ?? 0) + 0.05) / ((low ?? 0) + 0.05);
};

describe('text reaches 4.5:1 on its surface (D12)', () => {
  const modes = [
    ['light', light, themes.light],
    ['dark', dark, themes.dark],
  ] as const;

  const pairs = modes.flatMap(([mode, { colours }, { button }]) => {
    const { surface, text } = colours;
    const surfaces = {
      canvas: surface.canvas,
      default: surface.default,
      muted: surface.muted,
      sunken: surface.sunken,
    };

    const textOnSurface = (['primary', 'secondary'] as const).flatMap((role) =>
      Object.entries(surfaces).map(([name, bg]) => ({
        mode,
        pair: `text.${role} on surface.${name}`,
        fg: text[role],
        bg,
      })),
    );

    // A button label sits on the button, or on the page behind a transparent one.
    const labels = (['primary', 'secondary', 'tertiary'] as const).flatMap((variant) => {
      const { label, background, backgroundPressed } = button[variant];
      const behind =
        background === surface.transparent ? [surface.canvas, surface.default] : [background];
      return [...behind, backgroundPressed].map((bg) => ({
        mode,
        pair: `button.${variant} label on ${bg}`,
        fg: label,
        bg,
      }));
    });

    return [...textOnSurface, ...labels];
  });

  it.each(pairs)('$mode · $pair', ({ fg, bg }) => {
    expect(contrast(fg, bg)).toBeGreaterThanOrEqual(4.5);
  });
});
