/**
 * Criteria C2 and C5 — colour literals live in the primitive token layer only.
 *
 * Checks every string and template literal, so a colour inside a shadow string
 * is caught too. Functional notations only count when a number follows the
 * parenthesis: `rgba(${r}, ...)` builds a colour, it is not a literal one.
 */
const HEX = /(?<![\w&])#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})(?![\w-])/i;
const FUNCTIONAL = /\b(?:rgba?|hsla?|hwb|oklch)\(\s*[-+.\d]/i;

const findColour = (text) => (HEX.exec(text) ?? FUNCTIONAL.exec(text))?.[0];

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Colour literals may only appear in the primitive token layer',
    },
    schema: [],
    messages: {
      colourLiteral:
        'Colour literal "{{colour}}" outside the primitive token layer. Use a token from src/theme instead. See constitution §6.',
    },
  },
  create(context) {
    const check = (node, text) => {
      const colour = findColour(text);
      if (colour) context.report({ node, messageId: 'colourLiteral', data: { colour } });
    };

    return {
      Literal(node) {
        if (typeof node.value === 'string') check(node, node.value);
      },
      TemplateElement(node) {
        check(node, node.value.cooked ?? node.value.raw);
      },
    };
  },
};
