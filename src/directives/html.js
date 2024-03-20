import evaluate from '../evaluate.js';
import {
  accessedPaths,
  startWatchingPaths,
  stopWatchingPaths
} from '../watcher.js';

export default function htmlDirective(
  reactiveNode,
  scope,
  directiveNode,
  nodeValue
) {
  directiveNode = directiveNode.parentElement;
  const exp = nodeValue.trim().slice(3, -3).trim();

  startWatchingPaths();
  const value = evaluate(scope, exp);
  stopWatchingPaths();

  // html can only bind to a single path
  accessedPaths.map(({ obj, key }) => {
    reactiveNode.on(obj, key, () => {
      directiveNode.innerHTML = evaluate(scope, exp);
    });
  });

  directiveNode.innerHTML = value;
}
