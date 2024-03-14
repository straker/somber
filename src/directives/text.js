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
  const expressions = nodeValue.match(expressionRegex).map(expStr => {
    return expStr.slice(2, -2).trim();
  });

  const expressionValues = [];
  expressions.map((exp, index) => {
    startWatchingPaths();
    const value = evaluate(scope, exp);
    stopWatchingPaths();
    expressionValues.push(value);
    accessedPaths.map(path => {
      reactiveNode.on(path.obj, path.key, () => {
        expressionValues[index] = evaluate(scope, expressions[index]);
        setText(
          scope,
          directiveNode,
          staticStrings,
          expressionValues
        );
      });
    });
  });

  setText(scope, directiveNode, staticStrings, expressionValues);
}

function setText(scope, node, staticStrings, expressionValues) {
  let nodeValue = staticStrings[0];
  for (let i = 0; i < expressionValues.length; i++) {
    nodeValue += expressionValues[i] + staticStrings[i + 1];
  }

  node.nodeValue = nodeValue;
}
