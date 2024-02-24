import evaluate from '../evaluate.js';
import { accessedVars, clearAccessedVars } from '../watcher.js';
import walk from '../walk.js';

const destructuredRegex = /\(\s*(?<value>\w+),\s*(?<key>\w+),?\s*(?<index>\w+)?\s*\)/

export default function forDirective(reactiveNode, scope, directiveNode, name, exp) {
  const parts = exp.split(' in ').map(part => part.trim());
  const template = directiveNode.firstElementChild;
  const iterable = evaluate(scope, parts[1]);

  let value = parts[0];
  let key;
  let index;
  if (value.startsWith('(')) {
    const { groups } = value.match(destructuredRegex);
    value = groups.value;
    key = groups.key;
    index = groups.index;
  }

  // don't let children get evaluated since we need to change the
  // scope with the new values
  for (const child of directiveNode.children) {
    child.remove();
  }

  // array
  if (Array.isArray(iterable)) {
    iterable.map((item, index) => {
      const ctx = {
        ...scope,
        [value]: iterable[index],
        [key]: index
      };
      setChild(reactiveNode, ctx, directiveNode, template);
    });
  }
  // object
  else {
    Object.entries(iterable).map(([objKey, objValue], objIndex) => {
      const ctx = {
        ...scope,
        [value]: objValue,
        [key]: objKey,
        [index]: objIndex
      };
      setChild(reactiveNode, ctx, directiveNode, template);
    });
  }
}

function setChild(reactiveNode, scope, node, template) {
  const child = template.cloneNode(true);
  walk(reactiveNode, scope, child);
  node.appendChild(child);
}