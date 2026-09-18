import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Criterion A2 names four compiler flags. Setting them in tsconfig.json is
 * what makes them take effect; this test is what stops someone quietly
 * removing one later. Without it, A2 would be a documented agreement, which
 * is the thing the constitution's golden rule forbids.
 */
describe('tsconfig strictness (A2)', () => {
  const tsconfig = JSON.parse(readFileSync(join(__dirname, '..', 'tsconfig.json'), 'utf8')) as {
    compilerOptions: Record<string, unknown>;
  };

  const required = [
    'strict',
    'noUncheckedIndexedAccess',
    'exactOptionalPropertyTypes',
    'noImplicitOverride',
  ];

  it.each(required)('has %s enabled', (flag) => {
    expect(tsconfig.compilerOptions[flag]).toBe(true);
  });
});
