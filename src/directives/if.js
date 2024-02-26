import bindDirective from './bind.js';

/**
 * If directive is just syntactic sugar for setting the `hidden` attribute. Essentially this is just an alias for :show directive
 */
export default function ifDirective(
  reactiveNode,
  scope,
  directiveNode,
  name,
  exp
) {
  bindDirective(
    reactiveNode,
    scope,
    directiveNode,
    'hidden',
    exp,
    true
  );
}