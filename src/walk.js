import {
  bindDirective,
  eventDirective,
  forDirective,
  htmlDirective,
  ifDirective,
  modelDirective,
  showDirective,
  textDirective
} from './directives/index.js';

// export for testing purposes only
export const _directives = {
  bind: bindDirective,
  event: eventDirective,
  for: forDirective,
  html: htmlDirective,
  if: ifDirective,
  model: modelDirective,
  show: showDirective,
  text: textDirective
};

const walkCache = new WeakMap();

export default function walk(reactiveNode, scope, rootNode) {
  const walker = document.createNodeIterator(
    rootNode,
    NodeFilter.SHOW_ALL
  );
  let node;

  // node iterator is a live list meaning that any new elements
  // added to the DOM during traversal will also get processed
  while ((node = walker.nextNode())) {
    if (walkCache.has(node)) {
      continue;
    }
    walkCache.set(node, 1);

    const { nodeType, nodeValue } = node;
    if (nodeType == 1) {
      // Node.ELEMENT_NODE
      const hasForBinding = node.hasAttribute(':for');
      for (let { name, value } of [...node.attributes]) {
        const type = name[0];

        // only perform logic on bound values
        if (![':', '@'].includes(type)) {
          continue;
        }

        node.removeAttribute(name);
        name = name.substr(1);

        if (name == 'key' && hasForBinding) {
          continue;
        }

        const directive =
          type == '@'
            ? _directives.event
            : _directives[name] ?? _directives.bind;
        directive(reactiveNode, scope, node, name, value.trim());
      }
    } else if (nodeType == 3) {
      // only perform logic on bound values
      if (!nodeValue.includes('{{')) {
        continue;
      }

      _directives[nodeValue.includes('{{{') ? 'html' : 'text'](
        reactiveNode,
        scope,
        node,
        nodeValue.trim()
      );
    }
  }
}
