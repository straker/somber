import SomberElement from '../somber-element.js';
import evaluate from '../evaluate.js';
import parse from '../parse.js';
import { emit } from '../events.js';

// 0 and empty string are not considered falsey
const falseyValues = [false, undefined, null];

export default function bindDirective(
  reactiveNode,
  scope,
  directiveNode,
  name,
  exp,
  falsey
) {
  parse(scope, exp).map(({ obj, key }) => {
    reactiveNode.on(obj, key, () => {
      setAttribute(directiveNode, name, evaluate(scope, exp), falsey);
    });
  });

  setAttribute(directiveNode, name, evaluate(scope, exp), falsey);
}

function setAttribute(node, name, value, falsey) {
  value = falsey ? !value : value;

  // set component props on somber elements only, otherwise
  // set binding normally (that way we can handle normal custom
  // elements with observed attributes)
  const element = customElements.get(node.nodeName.toLowerCase());
  if (
    element &&
    element.prototype instanceof SomberElement &&
    element.observedAttributes?.includes(name)
  ) {
    Object.defineProperty(node, name, {
      get() {
        return value;
      },
      set(value) {},
      configurable: true
    });

    return emit(node, name);
  }

  // class attribute will be set with an object
  if (name == 'class') {
    return Object.entries(value).map(([propName, condition]) => {
      propName = propName.trim().split(/\s+/g);
      node.classList[condition ? 'add' : 'remove'](...propName);
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
  if (!name.startsWith('aria-')) {
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
  if (falseyValues.includes(value)) {
    return node.removeAttribute(name);
  }

  node.setAttribute(name, value);
}
