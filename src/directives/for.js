import evaluate from '../evaluate.js';
import walk from '../walk.js';
import {
  watch,
  accessedPaths,
  startWatchingPaths,
  stopWatchingPaths
} from '../watcher.js';
import { markNode, getNodesBetweenMark } from '../utils.js';

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

  const forKey = directiveNode.getAttribute(':key');
  directiveNode.removeAttribute(':key');

  markNode(directiveNode); // save spot in DOM
  // directiveNode.remove();  // start with a clean slate

  startWatchingPaths();
  const iterable = evaluate(scope, iterator);
  stopWatchingPaths();

  // iterator can only bind to a single path
  accessedPaths.map(({ obj, key }) => {
    reactiveNode.on(obj, key, () => {
      setItems(
        reactiveNode,
        scope,
        directiveNode,
        iterable,
        valueAlias,
        keyAlias,
        indexAlias,
        forKey
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
    forKey
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
  forKey
) {
  const items = createItems(
    reactiveNode,
    scope,
    directiveNode,
    iterable,
    value,
    key,
    index,
    forKey
  );

  const existingNodes = getNodesBetweenMark(directiveNode);

  // TODO: what should happen if the browser is currently
  // focused on an element that is a child of the node that
  // will be removed / replaced?

  if (!forKey) {
    existingNodes.map(node => node.remove());
    // by inserting before the end mark we can easily put all
    // the items in order as we don't have to keep track of
    // the last item placed and try to insert after that one
    items.map(node => directiveNode.__a.before(node));
  }

  const length = Math.max(items.length, existingNodes.length);
  for (let i = 0; i < length; i++) {
    const item = items[i];
    const curNode = existingNodes[i];

    // sparse array with empty spot
    if (!item && !curNode) {
      continue;
    }
    // new item
    else if (item && !curNode) {
      directiveNode.__a.before(item);
    }
    // removed item
    else if (curNode && !item) {
      curNode.remove();
    }
    // changed item
    else if (curNode.__k != item.__k) {
      curNode.replaceWith(item);
    }
    // same item (do nothing)
  }
}

function createItems(
  reactiveNode,
  scope,
  directiveNode,
  iterable,
  value,
  key,
  index,
  forKey
) {
  if (Array.isArray(iterable)) {
    return iterable.map((item, index) => {
      const ctx = watch({
        ...scope,
        // use a getter so when the state is updated the scope
        // value reflects the current state of the iterable
        get [value]() {
          return iterable[index];
        },
        [key ?? '$index']: index
      });
      return createItem(reactiveNode, ctx, directiveNode, forKey);
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
    return createItem(reactiveNode, ctx, directiveNode, forKey);
  });
}

function createItem(reactiveNode, scope, directiveNode, forKey) {
  const item = directiveNode.cloneNode(true);
  // __k = key
  item.__k = evaluate(scope, forKey);
  walk(reactiveNode, scope, item);
  return item;
}
