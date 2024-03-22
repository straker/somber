import bindDirective from './bind.js';

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
