/**
 * @jest-environment node
 *
 * Criterion B5 — each boundary rule has a fixture that ESLint reports as an
 * error, and this suite fails if a fixture stops being reported.
 *
 * This is the test that turns constitution §4 from a document into something
 * the build enforces. Without it, a boundary rule could be downgraded to a
 * warning, scoped to nothing, or deleted, and every other test would still
 * pass.
 */
import { ESLint } from 'eslint';
import { parser as tsParser } from 'typescript-eslint';
import { join } from 'node:path';
// The same rule objects the real source tree is linted with. Building the
// config here rather than loading a config file keeps the two in lockstep and
// avoids ESLint's dynamic config import, which Jest cannot do without
// --experimental-vm-modules.
import architecture from '../../eslint.boundaries';

const FIXTURE_ROOT = join(__dirname, 'fixtures');

interface Expectation {
  file: string;
  rule: string;
  criterion: string;
}

const EXPECTED: Expectation[] = [
  {
    criterion: 'B1',
    file: 'src/features/budgets/ui/b1-cross-feature-internal.ts',
    rule: 'boundaries/dependencies',
  },
  {
    criterion: 'B2',
    file: 'src/shared/lib/b2-shared-imports-feature.ts',
    rule: 'boundaries/dependencies',
  },
  {
    criterion: 'B3',
    file: 'src/app/b3-not-a-route.ts',
    rule: 'architecture/app-routes-only',
  },
];

const lintFixture = async (relativePath: string) => {
  const eslint = new ESLint({
    cwd: FIXTURE_ROOT,
    // `true` means "use no config file at all", so only the config below applies.
    overrideConfigFile: true,
    overrideConfig: [
      {
        files: ['src/**/*.{ts,tsx}'],
        // The fixtures are TypeScript, so the run needs the TypeScript parser.
        // The real tree gets this from eslint-config-expo.
        languageOptions: { parser: tsParser },
        plugins: architecture.plugins,
        settings: {
          ...architecture.settings,
          // The plugin matches element patterns against paths relative to the
          // project root, which under Jest is the repository. Pointing it at
          // the fixture tree makes `src/features/*` mean the fixture's own src.
          'boundaries/root-path': FIXTURE_ROOT,
          // Imports are resolved to decide which element they belong to. Without
          // a resolver that knows about .ts files, every import looks unknown
          // and the boundary rules have nothing to judge. The real tree gets
          // this from eslint-config-expo.
          'import/resolver': { node: { extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'] } },
        },
        rules: architecture.rules,
      },
      {
        files: ['src/**/*.{ts,tsx}'],
        ignores: ['src/app/**/*'],
        rules: { 'architecture/app-routes-only': 'off' },
      },
    ] as never,
    // The fixtures are ignored by the project config on purpose. Linting them
    // here is the one place their errors are wanted.
    ignore: false,
  });
  const results = await eslint.lintFiles([join(FIXTURE_ROOT, relativePath)]);
  const messages = results.flatMap((r) => r.messages);

  // A fixture that fails to parse reports one fatal message and no rule
  // errors, which would look exactly like a rule that stopped firing.
  const fatal = messages.find((m) => m.fatal);
  if (fatal) throw new Error(`${relativePath} failed to parse: ${fatal.message}`);

  return messages;
};

describe('architecture boundaries (B5)', () => {
  it.each(EXPECTED)('$criterion · $file is reported by $rule', async ({ file, rule }) => {
    const messages = await lintFixture(file);
    const ruleIds = messages.map((m) => m.ruleId);

    expect(ruleIds).toContain(rule);
    expect(messages.find((m) => m.ruleId === rule)?.severity).toBe(2);
  });

  it('reports every fixture, so none has quietly stopped failing', async () => {
    const perFixture = await Promise.all(
      EXPECTED.map(async (e) => ({
        criterion: e.criterion,
        errors: (await lintFixture(e.file)).filter((m) => m.severity === 2).length,
      })),
    );
    const silent = perFixture.filter((f) => f.errors === 0).map((f) => f.criterion);
    expect(silent).toEqual([]);
  });
});
