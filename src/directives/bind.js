import evaluate from '../evaluate.js';
import {
  accessedPaths,
  startWatchingPaths,
  stopWatchingPaths
} from '../watcher.js';
import { emit } from '../events.js';

// 0 is not considered falsey
const falseyValues = [false, undefined, null, ''];

export default function bindDirective(
  reactiveNode,
  scope,
  directiveNode,
  name,
  exp,
  falsey
) {
  startWatchingPaths();
  const value = evaluate(scope, exp);
  stopWatchingPaths();

  accessedPaths.map(({ obj, key }) => {
    reactiveNode.on(obj, key, () => {
      setAttribute(directiveNode, name, evaluate(scope, exp), falsey);
    });
  });

  setAttribute(directiveNode, name, value, falsey);
}

function setAttribute(node, name, value, falsey) {
  value = falsey ? !value : value;

  // set component props
  if (
    customElements
      .get(node.nodeName.toLowerCase())
      ?.observedAttributes?.includes(name)
  ) {
    Object.defineProperty(node, name, {
      get() {
        accessedPaths.push({ obj: node, key: name, value });
        return value;
      },
      configurable: true
    });

    emit(node, name);
    return;
  }

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
        return (node.style[propName] = '');
      }

      node.style[propName] = condition;
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
    // eslint-disable-next-line no-restricted-syntax
    if (value === true) {
      value = '';
    }

    return node.setAttribute(name, value);
  }

  // eslint-disable-next-line no-restricted-syntax
  if (value === false) {
    return node.setAttribute(name, 'false');
  }
  // falsey (except 0) boolean aria attributes get removed
  else if (falseyValues.includes(value)) {
    return node.removeAttribute(name);
  }

  node.setAttribute(name, value);
}
