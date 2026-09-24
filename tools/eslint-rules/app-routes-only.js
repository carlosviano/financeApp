/**
 * Criterion B3 — `src/app/**` holds routes and layouts only.
 *
 * expo-router treats a file in the routes directory as a route when it has a
 * default export, and ignores a file whose name starts with an underscore.
 * A file with neither is a helper, a stylesheet or a component that somebody
 * parked next to the routes, and it belongs somewhere else.
 *
 * Checking for the default export is what makes this mechanical. The
 * alternative — a list of allowed filenames — goes stale the moment a route
 * is added.
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Files in the routes directory must be routes or layouts, or be prefixed with an underscore',
    },
    schema: [],
    messages: {
      notARoute:
        'src/app holds routes and layouts only. "{{name}}" has no default export, so expo-router will not treat it as a route. Move it out of src/app, or prefix the filename with an underscore.',
    },
  },
  create(context) {
    const filename = context.filename ?? context.getFilename();
    const name = filename.split('/').pop() ?? filename;

    // Underscore-prefixed files are invisible to expo-router, which is the
    // documented escape hatch for a helper that genuinely has to live here.
    if (name.startsWith('_')) return {};

    let hasDefaultExport = false;

    return {
      ExportDefaultDeclaration() {
        hasDefaultExport = true;
      },
      ExportNamedDeclaration(node) {
        // `export { Thing as default }` counts too.
        if (node.specifiers.some((s) => s.exported.name === 'default')) hasDefaultExport = true;
      },
      'Program:exit'(node) {
        if (!hasDefaultExport) {
          context.report({ node, messageId: 'notARoute', data: { name } });
        }
      },
    };
  },
};
