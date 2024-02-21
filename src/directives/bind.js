import evaluate from '../evaluate.js';
import { accessedVars, clearAccessedVars } from '../watcher.js';


export default function bindDirective(scope, node, name, exp, falsey) {

  clearAccessedVars();
  const value = evaluate(scope, exp);
  accessedVars.map(variable => {
    scope.addEventListener(variable, event => {
      setAttribute(node, name, evaluate(scope, exp), falsey);
    });
  });

  setAttribute(node, name, value, falsey);
}

function setAttribute(node, name, value, falsey) {
  value = falsey ? !value : value;
  const ariaAttr = name.startsWith('aria-');

  // class will be set with an object
  if (name == 'class') {
    for (const [className, condition] of Object.entries(value)) {
      if (condition) {
        return node.classList.add(className);
      }

      return node.classList.remove(className);
    }
  }

  // falsey boolean non-aria attributes will automatically be
  // removed
  if (!ariaAttr) {
    if ([false, undefined, null, ''].includes(value)) {
      return node.removeAttribute(name);
    }

    // boolean attributes should be set with empty value
    if (value === true) {
      value = '';
    }

    return node.setAttribute(name, value);
  }

  if (value) {
    return node.setAttribute(name, value);
  }

  // falsey boolean aria attributes use the literal string
  // "false"
  node.setAttribute(name, 'false');
}