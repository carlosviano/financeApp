/**
 * The architecture rules from constitution §4, in one place.
 *
 * This module is consumed twice: by `eslint.config.js` for the real source
 * tree, and by `tests/architecture/fixtures/eslint.config.js` for the fixture
 * tree that proves the rules still fire. Sharing the objects is the point —
 * weakening a rule here changes both, and the fixture test fails when a
 * violation stops being reported (criterion B5).
 */
const boundaries = require('eslint-plugin-boundaries');
const appRoutesOnly = require('./tools/eslint-rules/app-routes-only');

/** Names the B4 scan looks for in eslint-disable directives. */
const BOUNDARY_RULE_NAMES = [
  'boundaries/dependencies',
  'boundaries/no-private',
  'architecture/app-routes-only',
  'no-restricted-imports',
  // Not boundary rules, but switching them off inline defeats C2 and C6.
  'design-system/no-colour-literals',
  'no-restricted-syntax',
];

const settings = {
  'boundaries/include': ['src/**/*'],
  'boundaries/elements': [
    { type: 'app', pattern: 'src/app/**/*', partialMatch: false },
    { type: 'feature', pattern: 'src/features/*', capture: ['featureName'] },
    { type: 'shared', pattern: 'src/shared/**/*', partialMatch: false },
    { type: 'theme', pattern: 'src/theme/**/*', partialMatch: false },
  ],
};

const rules = {
  // B2 — who may import whom. `shared` has no policy allowing `feature`, so a
  // shared module importing a feature is an error. The dependency arrow points
  // one way: app depends on features, features depend on shared, shared
  // depends on nothing above it.
  'boundaries/dependencies': [
    'error',
    {
      default: 'disallow',
      policies: [
        {
          from: { element: { type: 'app' } },
          allow: { to: { element: { types: { anyOf: ['feature', 'shared', 'theme'] } } } },
        },
        {
          from: { element: { type: 'feature' } },
          allow: { to: { element: { types: { anyOf: ['feature', 'shared', 'theme'] } } } },
        },
        {
          from: { element: { type: 'shared' } },
          allow: { to: { element: { types: { anyOf: ['shared', 'theme'] } } } },
        },
        {
          from: { element: { type: 'theme' } },
          allow: { to: { element: { type: 'theme' } } },
        },
        // B1 — a feature is entered through its index.ts and nowhere else.
        // Without this the policy above would happily allow one feature to
        // reach into another's model/ directory, and the public API would be
        // a suggestion. Listed last so it narrows the allow above it.
        {
          from: { element: { type: 'feature' } },
          disallow: { to: { element: { type: 'feature' }, file: { path: '!index.ts' } } },
          message:
            'Import through the feature index instead of reaching into its internals. See constitution §4.',
        },
      ],
    },
  ],

  // B3 — routes directory holds routes.
  'architecture/app-routes-only': 'error',
};

const plugins = {
  boundaries,
  architecture: { rules: { 'app-routes-only': appRoutesOnly } },
};

module.exports = { settings, rules, plugins, BOUNDARY_RULE_NAMES };
