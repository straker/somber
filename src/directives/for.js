import evaluate from '../evaluate.js';
import walk from '../walk.js';
import parse from '../parse.js';
import { variableName } from '../utils.js';

const forRegex = / (?:in|of) /;
// match "(value, key, index)" with index being optional
const aliasRegex = new RegExp(
  `\\(\\s*(${variableName}),\\s*(${variableName}),?\\s*(${variableName})?\\s*\\)`,
  'u'
);

/**
 * Output the contents of the element multiple times. Takes an array or object.
 *
 * The value must be in the form of either `alias in expression` or `alias of expression`, similar to a JavaScript `for..of` or `for..in` statement. If the syntax is not correct it will throw a SyntaxError of `invalid :for expression`.
 *
 * The `alias` value can be in the form of a single alias name, `(valueAlias, indexAlias)` if iterating over an array, or `(valueAlias, keyAlias, indexAlias)` if iterating over an object.
 *
 * If iterating over an array, the index value of the current item can be accessed using the `$index` property, unless the index value has been aliased by a different name.
 *
 * When values of the iterator change, the directive will update the outputted contents. The default behavior will remove the entire contents before adding back the current values. To change this behavior to update in-place, use the `key` property to give unique ids to each element. The `key` property is processed with the scope of the current item so can use the aliases from the :for directive.
 *
 * @example
 * <!-- Loop over an array -->
 * <ul :for="item in array">
 *   <li>{{ item }}</li>
 * </ul>
 *
 * <!-- Loop over an array with $index property -->
 * <ul :for="item in array">
 *   <li>{{ $index }}: {{ item }}</li>
 * </ul>
 *
 * <!-- Loop over an array with alias for index -->
 * <ul :for="(item, i) in array">
 *   <li>{{ i }}: {{ item }}</li>
 * </ul>
 *
 * <!-- Loop over an objects values -->
 * <ul :for="value in object">
 *   <li>{{ value }}</li>
 * </ul>
 *
 * <!-- Loop over an objects values with alias for key names -->
 * <ul :for="(value, key) in object">
 *   <li>{{ key }}: {{ value }}</li>
 * </ul>
 *
 * <!-- Loop over an objects values with alias for key names and index value -->
 * <ul :for="(value, key, index) in object">
 *   <li>{{ index}}: {{ key }}: {{ value }}</li>
 * </ul>
 *
 * <!-- Designate a unique key for each array item -->
 * <ul :for="(item, index) in array" :key="index">
 *   <li>{{ item }}</li>
 * </ul>
 *
 * <!-- Designate a unique key for each object item -->
 * <ul :for="item in objArray" :key="item.id">
 *   <li>{{ item.text }}</li>
 * </ul>
 *
 * @section For
 * @sectionof Directives
 */
export default function forDirective(
  reactiveNode,
  scope,
  directiveNode,
  name,
  exp
) {
  let [valueAlias, iterator] = exp
    .split(forRegex)
    .map(part => part.trim());

  if (!iterator) {
    throw new SyntaxError(`invalid :for expression: ${exp}`);
  }

  let keyAlias, indexAlias;
  if (aliasRegex.test(valueAlias)) {
    [, valueAlias, keyAlias, indexAlias] =
      valueAlias.match(aliasRegex);
  }

  const template = [...directiveNode.childNodes];
  const forKey = directiveNode.getAttribute(':key');
  directiveNode.removeAttribute(':key');

  const iterable = evaluate(scope, iterator);

  // iterator can only bind to a single path
  parse(scope, exp).map(({ obj, key }) => {
    reactiveNode.on(obj, key, () => {
      setItems(
        reactiveNode,
        scope,
        directiveNode,
        iterable,
        valueAlias,
        keyAlias,
        indexAlias,
        forKey,
        template
      );
    });
  });

  setItems(
    reactiveNode,
    scope,
    directiveNode,
    iterable,
    valueAlias,
    keyAlias,
    indexAlias,
    forKey,
    template
  );
}

function setItems(
  reactiveNode,
  scope,
  directiveNode,
  iterable,
  value,
  key,
  index,
  forKey,
  template
) {
  const items = createItems(
    scope,
    iterable,
    value,
    key,
    index,
    forKey,
    template
  );

  // TODO: what should happen if the browser is currently
  // focused on an element that is a child of the node that
  // will be removed / replaced?

  if (!forKey) {
    while (directiveNode.firstChild) {
      directiveNode.lastChild.remove();
    }
  }

  // use child nodes so we process text nodes as well
  // (account for any :if element that's been removed)
  const existingItems = [...directiveNode.childNodes];
  const length = Math.max(items.length, existingItems.length);
  for (let i = 0; i < length; i++) {
    const { item, ctx } = items[i] ?? {};
    const curItem = existingItems[i];

    // new item at end of list
    if (item && !curItem) {
      directiveNode.append(item);
      walk(reactiveNode, ctx, item);
    }
    // removed item
    else if (curItem && !item) {
      curItem.remove();
    }
    // changed item
    else if (curItem.__k != item.__k) {
      curItem.replaceWith(item);
      walk(reactiveNode, ctx, item);
    }
    // same item (do nothing)
  }
}

function createItems(
  scope,
  iterable,
  value,
  key,
  index,
  forKey,
  template
) {
  if (Array.isArray(iterable)) {
    return iterable
      .map((item, index) => {
        const ctx = {
          ...scope,
          // use a getter so when the state is updated the scope
          // value reflects the current state of the iterable
          get [value]() {
            return iterable[index];
          },
          [key ?? '$index']: index
        };
        return createItem(ctx, template, forKey).map(item => ({
          item,
          ctx
        }));
      })
      .flat();
  }

  return Object.keys(iterable)
    .map((objKey, objIndex) => {
      const ctx = {
        ...scope,
        get [value]() {
          return iterable[objKey];
        },
        [key]: objKey,
        [index]: objIndex
      };
      return createItem(ctx, template, forKey).map(item => ({
        item,
        ctx
      }));
    })
    .flat();
}

function createItem(scope, template, forKey) {
  return template.map(node => {
    const item = node.cloneNode(true);

    // k = key
    item.__k = evaluate(scope, forKey);
    return item;
  });
}
