import evaluate from '../evaluate.js';
import {
  accessedPaths,
  startWatchingPaths,
  stopWatchingPaths
} from '../watcher.js';
import { markNode } from '../utils.js';

export default function ifDirective(
  reactiveNode,
  scope,
  directiveNode,
  name,
  exp
) {
  markNode(directiveNode);

  startWatchingPaths();
  const value = evaluate(scope, exp);
  stopWatchingPaths();

  // html can only bind to a single path
  accessedPaths.map(({ obj, key }) => {
    reactiveNode.on(obj, key, () => {
      if (!evaluate(scope, exp)) {
        return directiveNode.remove();
      }

      // use __a.before instead of __b.after to match how :for
      // uses it and make gzip a little bit better
      directiveNode.__a.before(directiveNode);
    });
  });

  if (!value) {
    directiveNode.remove();
  }
}
