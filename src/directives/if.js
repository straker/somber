import bindDirective from './bind.js';

/**
 * If directive is just syntactic sugar for setting the `hidden` attribute
 */
export default function ifDirective(scope, node, name, exp) {
  bindDirective(scope, node, 'hidden', exp, true);
}