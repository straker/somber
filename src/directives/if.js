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
  const nodes = directiveNode.content
    ? [...directiveNode.content.childNodes]
    : [directiveNode];
  directiveNode.remove();

  startWatchingPaths();
  const value = evaluate(scope, exp);
  stopWatchingPaths();

  // html can only bind to a single path
  accessedPaths.map(({ obj, key }) => {
    reactiveNode.on(obj, key, () => {
      if (!evaluate(scope, exp)) {
        return nodes.map(node => node.remove());
      }

      insert(directiveNode, nodes);
    });
  });

  if (value) {
    insert(directiveNode, nodes);
  }
}

function insert(directiveNode, nodes) {
  // use __a.before instead of __b.after to match how :for
  // uses it and make gzip a little bit better
  nodes.map(node => directiveNode.__a.before(node));
}
