import evaluate from '../evaluate.js';
import walk from '../walk.js';
import {
  watchObject,
  accessedPaths,
  startWatchingPaths,
  stopWatchingPaths
} from '../watcher.js';

const destructuredRegex =
  /\(\s*(?<value>\w+),\s*(?<key>\w+),?\s*(?<index>\w+)?\s*\)/;

export default function forDirective(
  reactiveNode,
  scope,
  directiveNode,
  name,
  exp
) {
  let [value, iterator] = exp.split(' in ').map(part => part.trim());
  if (!iterator) {
    throw new Error(`invalid :for expression: ${exp}`);
  }

  let key, index;
  if (value.startsWith('(')) {
    ({ value, key, index } = value.match(destructuredRegex).groups);
  }

  const template = directiveNode.firstElementChild;
  const forKey = directiveNode.getAttribute(':key');
  directiveNode.removeAttribute(':key');

  startWatchingPaths();
  const iterable = evaluate(scope, iterator);
  stopWatchingPaths();

  accessedPaths.map(({ obj, key }) => {
    reactiveNode.on(obj, key, () => {
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
        if (currChild.__k == child.__k) {
          return;
        }

        // changed item
        currChild.replaceWith(child);
      });
    });
  });

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
      const ctx = watchObject({
        ...scope,
        // use a getter so when the state is updated the scope
        // value reflects the current state of the iterable
        get [value]() {
          return iterable[index];
        },
        [key]: index
      });
      return createChild(
        reactiveNode,
        ctx,
        directiveNode,
        template,
        forKey
      );
    });
  }

  return Object.keys(iterable).map((objKey, objIndex) => {
    const ctx = {
      ...scope,
      get [value]() {
        return iterable[objKey];
      },
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

function createChild(reactiveNode, scope, node, template, forKey) {
  const child = template.cloneNode(true);
  // __k = key
  child.__k = evaluate(scope, forKey);
  walk(reactiveNode, scope, child);
  return child;
}
