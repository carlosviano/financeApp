/**
 * Types for the CommonJS boundaries module, so the architecture tests can
 * import it without `require()` and without `any`.
 */
import type { Linter } from 'eslint';

declare const boundariesConfig: {
  settings: Record<string, unknown>;
  rules: Linter.RulesRecord;
  plugins: Record<string, unknown>;
  /** Rule names the B4 scan refuses to see in an eslint-disable directive. */
  BOUNDARY_RULE_NAMES: string[];
};

export = boundariesConfig;
