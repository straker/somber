import evaluate from '../evaluate.js';
import parse from '../parse.js';
import walk from '../walk.js';

export default function ifDirective(
  reactiveNode,
  scope,
  directiveNode,
  name,
  exp
) {
  const placeholderNode = document.createTextNode('');
  const value = evaluate(scope, exp);
  let preValue = value;

  // if can only bind to a single path
  parse(scope, exp).map(({ obj, key }) => {
    reactiveNode.on(obj, key, () => {
      const newValue = evaluate(scope, exp);
      if (newValue && !preValue) {
        placeholderNode.replaceWith(directiveNode);
        walk(reactiveNode, scope, directiveNode);
      } else if (!newValue && preValue) {
        directiveNode.replaceWith(placeholderNode);
      }
      preValue = newValue;
    });
  });

  if (!value) {
    return directiveNode.replaceWith(placeholderNode);
  }
}
