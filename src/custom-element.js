import { watchObject } from './watcher.js';

import bindDirective from './directives/bind.js';
import ifDirective from './directives/if.js';

const template = document.createElement('template');

export default class CustomElement extends HTMLElement {
  constructor() {
    super()
    this.state = {};
    this.props = {};
  }

  // props are one-way bound
  // get props() {
  //   return this.constructor.observedAttributes.reduce((obj, propName) => {

  //     const raw = this.getAttribute(propName);
  //     const trimRaw = raw.trim();
  //     let value = raw;

  //     if (trimRaw.startsWith('{') || trimRaw.startsWith('[')) {
  //       value = evaluate(this, raw);
  //     }

  //     obj[propName] = value;
  //     return obj;
  //   }, {});
  // }

  connectedCallback() {
    this.state = watchObject('state', this.state, this);
    this.appendChild(this.render());
  }

  attributeChangedCallback(name, oldValue, value) {
    if (oldValue !== value) {
      // props auto-update
      // this._u();
    }
  }

  html(str) {
    template.innerHTML = str;
    const walker = document.createNodeIterator(template.content.firstElementChild, NodeFilter.SHOW_ALL);
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
            ifDirective(this, node, name, value);
            break;
          default:
            bindDirective(this, node, name, value);
          }
        }
      }
    }

    return template.content.firstElementChild;
  }
}