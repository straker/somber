import bindDirective from './directives/bind.js';
import eventDirective from './directives/event.js';
import forDirective from './directives/for.js';
import htmlDirective from './directives/html.js';
import ifDirective from './directives/if.js';
import modelDirective from './directives/model.js';
import textDirective from './directives/text.js';

// export for testing purposes only
export const _directives = {
  bind: bindDirective,
  event: eventDirective,
  for: forDirective,
  html: htmlDirective,
  if: ifDirective,
  model: modelDirective,
  text: textDirective
};

export default function walk(reactiveNode, scope, rootNode) {
  const walker = document.createNodeIterator(
    rootNode,
    NodeFilter.SHOW_ALL
  );
  let node;

  while ((node = walker.nextNode())) {
    switch (node.nodeType) {
      case 1: {
        // Node.ELEMENT_NODE
        let hasForBinding = node.hasAttribute(':for');
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
          directive(reactiveNode, scope, node, name, value);
        }
        break;
      }
      case 3: // Node.TEXT_NODE
        const { nodeValue } = node;
        // only perform logic on bound values
        if (!nodeValue.includes('{{')) {
          continue;
        }

        _directives[nodeValue.includes('{{{') ? 'html' : 'text'](
          reactiveNode,
          scope,
          node,
          nodeValue
        );
    }
  }
}
