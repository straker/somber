import evaluate from '../evaluate.js';

export default function eventDirective(
  _,
  scope,
  directiveNode,
  name,
  exp
) {
  directiveNode.addEventListener(name, $event => {
    const value = evaluate({ ...scope, $event }, exp);
    if (typeof value == 'function') {
      value($event);
    }
  });
}
