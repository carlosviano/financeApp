/**
 * @jest-environment node
 *
 * Criterion B4 — a boundary rule may not be switched off inline.
 *
 * `eslint-disable` exists for good reasons and the project uses it nowhere
 * today. The rules it must never apply to are the architecture rules, because
 * those are the ones under pressure at 6pm on a Friday. This scan is a string
 * match: it catches the directive by rule name, and a determined person could
 * still work around it. That is an accepted limit, recorded in the spec.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

import boundariesConfig from '../../eslint.boundaries';

const { BOUNDARY_RULE_NAMES } = boundariesConfig;

const SRC = join(__dirname, '..', '..', 'src');

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

describe('boundary rules cannot be disabled inline (B4)', () => {
  const files = walk(SRC).filter((f) => /\.tsx?$/.test(f));

  it('finds source files to scan', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it.each(files)('%s has no disable directive for a boundary rule', (file) => {
    const source = readFileSync(file, 'utf8');
    const offenders = BOUNDARY_RULE_NAMES.filter((rule) =>
      new RegExp(String.raw`eslint-disable[^\n]*${rule.replace('/', '\\/')}`).test(source),
    );
    expect(offenders).toEqual([]);
  });
});
