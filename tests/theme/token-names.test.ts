/**
 * @jest-environment node
 *
 * C7 — semantic and component token names describe function, not appearance.
 */
import { themes } from '../../src/theme';
import { light } from '../../src/theme/semantic';

const APPEARANCE = ['green', 'red', 'blue', 'gold', 'teal', 'grey', 'gray', 'dark', 'light'];

/** Every key path in a token tree, e.g. `colours.text.onAccent`. */
const paths = (tree: object, prefix = ''): string[] =>
  Object.entries(tree).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return value !== null && typeof value === 'object' && !Array.isArray(value)
      ? [path, ...paths(value as object, path)]
      : [path];
  });

/** `backgroundPressed` → `background`, `pressed`. */
const words = (key: string) => key.split(/(?=[A-Z])/).map((w) => w.toLowerCase());

const offenders = (tree: object) =>
  paths(tree).filter((path) =>
    path.split('.').some((key) => words(key).some((w) => APPEARANCE.includes(w))),
  );

describe('token names describe function (C7)', () => {
  it('flags an appearance word', () => {
    expect(offenders({ text: { onGreen: 1, highlight: 1 } })).toEqual(['text.onGreen']);
  });

  it.each([
    ['semantic', light],
    ['component', themes.light],
  ])('%s tokens have none', (_layer, tree) => {
    expect(paths(tree).length).toBeGreaterThan(0);
    expect(offenders(tree)).toEqual([]);
  });
});
