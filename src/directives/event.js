import evaluate from '../evaluate.js';

export default function eventDirective(
  reactiveNode,
  scope,
  directiveNode,
  name,
  exp
) {
  directiveNode.addEventListener(name, $event => {
    const ctx = {
      ...scope,
      $event
    };
    const value = evaluate(ctx, exp);
    if (typeof value == 'function') {
      value($event);
    }
  });
}
