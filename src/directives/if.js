import evaluate from '../evaluate.js';
import {
  accessedPaths,
  startWatchingPaths,
  stopWatchingPaths
} from '../watcher.js';
import walk from '../walk.js';
import { markNode } from '../utils.js';

export default function ifDirective(
  reactiveNode,
  scope,
  directiveNode,
  name,
  exp
) {
  const placeholderNode = document.createTextNode('');

  startWatchingPaths();
  const value = evaluate(scope, exp);
  stopWatchingPaths();

  // if can only bind to a single path
  accessedPaths.map(({ obj, key }) => {
    let preValue = value;

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
