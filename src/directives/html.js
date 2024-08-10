import evaluate from '../evaluate.js';
import parse from '../parse.js';

/**
 * Output the value of an expression as raw HTML without escaping any special characters or processing any expressions within the value.
 *
 * Updates to the value will update the output.
 *
 * @example
 * <div>{{{ rawHTML }}}</div>
 *
 * @section Html
 * @sectionof Directives
 */
export default function htmlDirective(
  reactiveNode,
  scope,
  directiveNode,
  nodeValue
) {
  directiveNode = directiveNode.parentElement;
  const exp = nodeValue.slice(3, -3).trim();

  // html can only bind to a single path
  parse(scope, exp).map(({ obj, key }) => {
    reactiveNode.on(obj, key, () => {
      directiveNode.innerHTML = evaluate(scope, exp);
    });
  });

  directiveNode.innerHTML = evaluate(scope, exp);
}
