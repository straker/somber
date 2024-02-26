import evaluate from '../evaluate.js';
import walk from '../walk.js';
import { watchObject } from '../watcher.js';

const destructuredRegex = /\(\s*(?<value>\w+),\s*(?<key>\w+),?\s*(?<index>\w+)?\s*\)/

export default function forDirective(
  reactiveNode,
  scope,
  directiveNode,
  name,
  exp
) {
  let [ value, iterator ] = exp.split(' in ').map(part => part.trim());
  if (!iterator) {
    throw new Error(`invalid :for expression: ${exp}`)
  }

  const template = directiveNode.firstElementChild;
  const iterable = evaluate(scope, iterator);

  let key;
  let index;
  if (value.startsWith('(')) {
    ({ value, key, index } = value.match(destructuredRegex).groups);
  }

  const forKey = directiveNode.getAttribute(':key');
  directiveNode.removeAttribute(':key');

  const children = createChildren(
    reactiveNode,
    scope,
    directiveNode,
    template,
    iterator,
    iterable,
    value,
    key,
    index,
    forKey
  );
  // don't let children get evaluated since we need to change the
  // scope with the new values
  removeChildren(directiveNode);
  directiveNode.append(...children);

  reactiveNode.addEventListener(iterator, () => {
    const children = createChildren(
      reactiveNode,
      scope,
      directiveNode,
      template,
      iterator,
      iterable,
      value,
      key,
      index,
      forKey
    );

    // TODO: what should happen if the browser is currently
    // focused on an element that is a child of the node that
    // will be removed / replaced?

    if (!forKey) {
      removeChildren(directiveNode);
      return directiveNode.append(...children);
    }

    children.map((child, index) => {
      const currChild = directiveNode.children[index];

      // new item
      if (!currChild) {
        return directiveNode.appendChild(child);
      }

      // same item
      if (currChild.__k === child.__k) {
        return;
      }

      // changed item
      currChild.replaceWith(child);
    });
  });
}

function removeChildren(directiveNode) {
  while (directiveNode.firstChild) {
    directiveNode.removeChild(directiveNode.lastChild);
  }
}

function createChildren(
  reactiveNode,
  scope,
  directiveNode,
  template,
  iterator,
  iterable,
  value,
  key,
  index,
  forKey
) {
  if (Array.isArray(iterable)) {
    return iterable.map((item, index) => {
      const ctx = watchObject(iterator + '.' + index, {
        ...scope,
        // TODO: updating the value reference needs to trigger
        // an update, but to do so this ctx object needs to be
        // watched
        get [value]() {
          return iterable[index]
        },
        [key]: index
      }, reactiveNode, false);
      return createChild(
        reactiveNode,
        ctx,
        directiveNode,
        template,
        forKey
      );
    });
  }

  return Object.entries(iterable).map(([objKey, objValue], objIndex) => {
    const ctx = {
      ...scope,
      [value]: objValue,
      [key]: objKey,
      [index]: objIndex
    };
    return createChild(
      reactiveNode,
      ctx,
      directiveNode,
      template,
      forKey
    );
  });
}

function createChild(
  reactiveNode,
  scope,
  node,
  template,
  forKey
) {
  const child = template.cloneNode(true);
  // __k = key
  child.__k = evaluate(scope, forKey);
  walk(reactiveNode, scope, child);
  return child;
}