/**
 * @jest-environment node
 *
 * C6, linted with the real project config. Type-aware rules are turned
 * off because the snippets are not files in the TypeScript program.
 */
import { ESLint, type Linter } from 'eslint';
import { configs } from 'typescript-eslint';
import { join } from 'node:path';

import projectConfig from '../../eslint.config.js';

const ROOT = join(__dirname, '..', '..');

const eslint = new ESLint({
  cwd: ROOT,
  overrideConfigFile: true,
  overrideConfig: [
    ...projectConfig,
    { files: ['**/*.{ts,tsx}'], ...configs.disableTypeChecked },
  ] as Linter.Config[],
});

const ruleErrors = async (rule: string, file: string, code: string) => {
  const [result] = await eslint.lintText(code, { filePath: join(ROOT, file) });
  return (result?.messages ?? []).filter((m) => m.ruleId === rule && m.severity === 2).length;
};

describe('inline styles hold no literal values (C6)', () => {
  const FILE = 'src/shared/ui/Box.tsx';

  it.each([
    '<View style={{ flex: 1 }} />;',
    '<View style={{ marginTop: -4 }} />;',
    "<View style={[styles.box, { width: '50%' }]} />;",
    '<View style={{ width: `100%` }} />;',
    '<ScrollView contentContainerStyle={{ padding: 8 }} />;',
  ])('reports %s', async (code) => {
    expect(await ruleErrors('no-restricted-syntax', FILE, code)).toBe(1);
  });

  it.each([
    '<View style={styles.box} />;',
    '<View style={[styles.box, { opacity }]} />;',
    '<View style={{ width: size }} />;',
  ])('allows %s', async (code) => {
    expect(await ruleErrors('no-restricted-syntax', FILE, code)).toBe(0);
  });
});
