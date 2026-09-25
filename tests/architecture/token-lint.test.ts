/**
 * @jest-environment node
 *
 * C1 and C6, linted with the real project config. Type-aware rules are turned
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

describe('token layers are read only by the layer above (C1)', () => {
  it.each([
    ['src/theme/semantic.ts', "import { palette } from './primitives';"],
    ['src/theme/components.ts', "import { light } from './semantic';"],
  ])('%s may import the layer below', async (file, code) => {
    expect(await ruleErrors('no-restricted-imports', file, code)).toBe(0);
  });

  it.each([
    ['src/theme/components.ts', "import { palette } from './primitives';"],
    ['src/theme/index.ts', "import { light } from './semantic';"],
    ['src/shared/ui/Card.tsx', "import { palette } from '@/theme/primitives';"],
    ['src/features/budgets/ui/Bar.tsx', "import { light } from '../../../theme/semantic';"],
  ])('%s may not skip a layer', async (file, code) => {
    expect(await ruleErrors('no-restricted-imports', file, code)).toBe(1);
  });
});

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
