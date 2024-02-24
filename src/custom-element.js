import { watchObject } from './watcher.js';
import walk from './walk.js';

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
    walk(this, this, template.content.firstElementChild);

    return template.content.firstElementChild;
  }
}