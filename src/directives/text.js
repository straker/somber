import evaluate from '../evaluate.js';
import {
  accessedPaths,
  startWatchingPaths,
  stopWatchingPaths
} from '../watcher.js';

const expressionRegex = /\{\{.+?\}\}/g;

export default function textDirective(
  reactiveNode,
  scope,
  directiveNode,
  nodeValue
) {
  const staticStrings = nodeValue.split(expressionRegex);
  const expressions = nodeValue
    .match(expressionRegex)
    .map(expStr => {
      return expStr.slice(2, -2).trim();
    });

  expressions.map(exp => {
    startWatchingPaths();
    const value = evaluate(scope, exp);
    stopWatchingPaths();
    accessedPaths.map(path => {
      reactiveNode.on(path.obj, path.key, () => {
        setText(scope, directiveNode, staticStrings, expressions);
      });
    });
  });

  setText(scope, directiveNode, staticStrings, expressions);
}

function setText(scope, node, staticStrings, expressions) {
  let nodeValue = staticStrings[0];
  for (let i = 0; i < expressions.length; i++) {
    nodeValue += evaluate(scope, expressions[i]) + staticStrings[i + 1];
  }

  node.nodeValue = nodeValue;
}