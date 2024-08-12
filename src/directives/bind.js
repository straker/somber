/**
 * Bind a HTML attribute or component prop to a property value or expression. If binding to a class or style attribute `bind` also supports objects.
 *
 * Any HTML attribute may be bound using the `:[attrName]="[boundProperty]"` syntax. For example, to bind the `hidden` attribute to the `isHidden` property of the component you would do `:hidden="isHidden"`.
 *
 * Expressions that result in `false`, `null` or `undefined` will remove the attribute from the element. Other falsey values (such as an empty string or `0`) will not remove the attribute. For ARIA attributes, an expression that results in `false` will not remove the attribute (e.g. `:aria-disabled="false"`).
 *
 * If the attribute being bound is a JavaScript property on the component, it will instead bind the expression to the property and not set it as an HTML attribute. This behavior is limited to only SomberElements in order to support non-SomberElement custom elements.
 *
 * Class or style attribute bindings will not override a static class or style attribute. Instead only bound properties of the class or style binding will override any static properties.
 *
 * @example
 * <!-- bind an attribute to a property value -->
 * <a :href="homeLink">Home</a>
 *
 * <!-- bind an an attribute to an expression -->
 * <img :src="value ? value : 'http://example.com/img.png'">
 *
 * <!-- class binding -->
 * <div :class="{ main: state.isMain }"></div>
 * <div :class="{ main: state.main ? true : false }"></div>
 *
 * <!-- static class and class binding -->
 * <div class="main" :class="{ active: isActive }"></div>
 *
 * <!-- style binding -->
 * <div :style="{ padding: state.padding }"
 * <div :style="{ position: position ? position : 'relative' }"></div>
 *
 * <!-- static style and style binding -->
 * <div style="background: red" :style="{ color: textColor }"></div>
 *
 * @section Bind
 * @sectionof Directives
 */
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
