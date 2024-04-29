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

  // transfer :for key to placeholder
  if (directiveNode.__k) {
    placeholderNode.__k = directiveNode.__k;
  }

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

  // the element should be removed from the DOM so its
  // descendants are not walked. that way we're not
  // spending resources processing nodes that won't be
  // visible and probably contains bindings that aren't
  // ready
  if (!value) {
    return directiveNode.replaceWith(placeholderNode);
  }
}
