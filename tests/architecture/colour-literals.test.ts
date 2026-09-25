/**
 * @jest-environment node
 *
 * Criteria C2 and C5 — colour literals may appear in the primitive token layer
 * and nowhere else in the source.
 *
 * Two halves. The rule tests prove what the rule detects. The scope tests prove
 * the real project config switches it on everywhere except the primitive layer,
 * so the rule cannot be narrowed or dropped without this suite going red.
 */
import { ESLint, RuleTester, type Linter } from 'eslint';
import { parser as tsParser } from 'typescript-eslint';
import { join } from 'node:path';

import projectConfig from '../../eslint.config.js';
import noColourLiterals from '../../tools/eslint-rules/no-colour-literals';

const RULE = 'design-system/no-colour-literals';
const ROOT = join(__dirname, '..', '..');

describe('no-colour-literals detects colour values', () => {
  const tester = new RuleTester({
    languageOptions: { parser: tsParser, parserOptions: { ecmaFeatures: { jsx: true } } },
  });
  const error = { messageId: 'colourLiteral' };

  tester.run('no-colour-literals', noColourLiterals, {
    valid: [
      "const label = 'Balance';",
      "const anchor = '#top';",
      "const id = '#12345';",
      "const entity = '&#123;';",
      'const pattern = /#[0-9a-f]{6}/;',
      'const derived = `rgba(${r}, ${g}, ${b}, 0.5)`;',
      "const name = 'rgba';",
    ],
    invalid: [
      { code: "const c = '#fff';", errors: [error] },
      { code: "const c = '#FFFF';", errors: [error] },
      { code: "const c = '#15161C';", errors: [error] },
      { code: "const c = '#15161C80';", errors: [error] },
      { code: "const c = 'rgb(0, 0, 0)';", errors: [error] },
      { code: "const c = 'rgba(21,22,28,.05)';", errors: [error] },
      { code: "const c = 'hsl(120, 50%, 50%)';", errors: [error] },
      { code: "const c = 'hsla(120, 50%, 50%, 0.5)';", errors: [error] },
      { code: "const c = 'hwb(120 10% 10%)';", errors: [error] },
      { code: "const c = 'oklch(47% 0.185 264)';", errors: [error] },
      { code: "const shadow = '0 1px 2px rgba(21,22,28,.05)';", errors: [error] },
      { code: 'const c = `border: 1px solid #ccc`;', errors: [error] },
      { code: '<View style={styles.box} accessibilityHint="#000" />;', errors: [error] },
    ],
  });
});

describe('no-colour-literals is on everywhere except the primitive layer', () => {
  const eslint = new ESLint({ cwd: ROOT, overrideConfigFile: true, overrideConfig: projectConfig });

  const severity = async (file: string) => {
    const config = (await eslint.calculateConfigForFile(join(ROOT, file))) as Linter.Config;
    const setting = config.rules?.[RULE];
    return Array.isArray(setting) ? setting[0] : setting;
  };

  it.each([
    ['C5', 'src/features/budgets/ui/BudgetBar.tsx'],
    ['C5', 'src/shared/ui/Card.tsx'],
    ['C5', 'src/app/index.tsx'],
    ['C2', 'src/theme/semantic.ts'],
    ['C2', 'src/theme/index.ts'],
    ['C5', 'eslint.config.js'],
  ])('%s · %s fails lint on a colour literal', async (_criterion, file) => {
    expect(await severity(file)).toBe(2);
  });

  it('exempts the primitive layer, where the colours live', async () => {
    expect(await severity('src/theme/primitives.ts')).toBeUndefined();
  });
});
