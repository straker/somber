import bindDirective from './directives/bind.js';
import ifDirective from './directives/if.js';
import textDirective from './directives/text.js';
import forDirective from './directives/for.js';
import eventDirective from './directives/event.js';

export default function walk(reactiveNode, scope, rootNode) {
  const walker = document.createNodeIterator(rootNode, NodeFilter.SHOW_ALL);
  let node;

  while (node = walker.nextNode()) {
    switch (node.nodeType) {
    case 1: // Node.ELEMENT_NODE
      let hasForBinding = node.hasAttribute(':for');
      for (let { name, value } of [...node.attributes]) {
        const type = name[0];

        // only perform logic on bound values
        if (![':', '@'].includes(type)) {
          continue;
        }

        node.removeAttribute(name);
        name = name.substr(1);

        if (type === '@') {
          eventDirective(reactiveNode, scope, node, name, value);
          continue;
        }

        switch(name) {
        case 'if':
          ifDirective(reactiveNode, scope, node, name, value);
          break;
        case 'for':
          forDirective(reactiveNode, scope, node, name, value);
          break;
        case 'key':
          if (hasForBinding) {
            continue;
          }
          // intentionally fall through to bind the attribute
        default:
          bindDirective(reactiveNode, scope, node, name, value);
        }
      }
      break;
    case 3: // Node.TEXT_NODE
      // only perform logic on bound values
      if (!node.nodeValue.includes('{{')) {
        continue;
      }

      textDirective(reactiveNode, scope, node, node.nodeValue);
    }
  }
}