import evaluate from '../evaluate.js';
import walk from '../walk.js';
import parse from '../parse.js';
import watch from '../watch.js';

const forRegex = / (?:in|of) /;
// match "(value, key, index)" with index being optional
const aliasRegex = /\(\s*(\w+),\s*(\w+),?\s*(\w+)?\s*\)/;

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
    throw new Error(`invalid :for expression: ${exp}`);
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
    reactiveNode,
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
    directiveNode.replaceChildren(...items);
  }

  // children is an HTMLCollection so we need to clone it
  // into an array to prevent it from live updating when
  // we add or remove children
  const existingItems = [...directiveNode.childNodes];
  const length = Math.max(items.length, existingItems.length);
  for (let i = 0; i < length; i++) {
    const item = items[i];
    const curItem = existingItems[i];

    // new item at end of list
    if (item && !curItem) {
      directiveNode.append(item);
    }
    // removed item
    else if (curItem && !item) {
      curItem.remove();
    }
    // changed item
    else if (curItem.__k != item.__k) {
      curItem.replaceWith(item);
    }
    // same item (do nothing)
  }
}

function createItems(
  reactiveNode,
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
        const ctx = watch({
          ...scope,
          // use a getter so when the state is updated the scope
          // value reflects the current state of the iterable
          get [value]() {
            return iterable[index];
          },
          [key ?? '$index']: index
        });
        return createItem(reactiveNode, ctx, template, forKey);
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
      return createItem(reactiveNode, ctx, template, forKey);
    })
    .flat();
}

function createItem(reactiveNode, scope, template, forKey) {
  return template.map(node => {
    const item = node.cloneNode(true);
    walk(reactiveNode, scope, item);
    item.__k = evaluate(scope, forKey);
    return item;
  });
}
