import evaluate from '../evaluate.js';
import { accessedVars, clearAccessedVars } from '../watcher.js';

// 0 is not considered falsey
const falseyValues = [false, undefined, null, ''];

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

  // class attribute will be set with an object
  if (name == 'class') {
    return Object.entries(value).map(([propName, condition]) => {
      if (!condition) {
        return node.classList.remove(propName);
      }

      node.classList.add(propName);
    });
  }

  // style attribute will be set with an object
  if (name == 'style') {
    return Object.entries(value).map(([propName, condition]) => {
      // remove style by setting to empty string
      // allow 0 value
      // @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style
      if (falseyValues.includes(condition)) {
        return node.style[propName] = '';
      }

      node.style[propName] = condition
    });
  }

  // falsey (except 0) boolean non-aria attributes will
  // automatically be removed
  if (!ariaAttr) {
    if (falseyValues.includes(value)) {
      return node.removeAttribute(name);
    }

    // boolean attributes should be set with empty value
    // @see https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute#value
    if (value === true) {
      value = '';
    }

    return node.setAttribute(name, value);
  }

  // falsey (except 0) boolean aria attributes use the literal
  // string "false"
  if (falseyValues.includes(value)) {
    return node.setAttribute(name, 'false');
  }


  node.setAttribute(name, value);
}