import evaluate from '../evaluate.js';
import { accessedVars, clearAccessedVars } from '../watcher.js';

const expressionRegex = /\{\{.+?\}\}/g;

export default function textDirective(reactiveNode, scope, directiveNode, nodeValue) {
  const staticStrings = nodeValue.split(expressionRegex);
  const expressions = nodeValue
    .match(expressionRegex)
    .map(expStr => {
      return expStr.slice(2, -2).trim();
    });

  expressions.map(exp => {
    clearAccessedVars();
    const value = evaluate(scope, exp);
    accessedVars.map(variable => {
      reactiveNode.addEventListener(variable, () => {
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