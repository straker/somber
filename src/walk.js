import bindDirective from './directives/bind.js';
import ifDirective from './directives/if.js';
import textDirective from './directives/text.js';
import forDirective from './directives/for.js';

export default function walk(reactiveNode, scope, rootNode) {
  const walker = document.createNodeIterator(rootNode, NodeFilter.SHOW_ALL);
  let node;

  while (node = walker.nextNode()) {
    switch (node.nodeType) {
    case 1: // Node.ELEMENT_NODE
      for (let { name, value } of [...node.attributes]) {

        // only perform logic on bound values
        if (!name.startsWith(':')) {
          continue;
        }

        node.removeAttribute(name);
        name = name.substr(1);

        switch(name) {
        case 'if':
          ifDirective(reactiveNode, scope, node, name, value);
          break;
        case 'for':
          forDirective(reactiveNode, scope, node, name, value);
          break;
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