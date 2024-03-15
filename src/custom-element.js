import { watchObject } from './watcher.js';
import walk from './walk.js';
import { on, off } from './events.js';

const template = document.createElement('template');

export default class CustomElement extends HTMLElement {
  #cbs = [];

  constructor() {
    super();
    this.state = {};
  }

  connectedCallback() {
    this.state = watchObject(this.state);

    if (this.render) {
      this.appendChild(this.render());
    }
  }

  on(obj, key, callback) {
    on(obj, key, callback);
    this.#cbs.push([obj, key, callback]);
  }

  disconnectedCallback() {
    this.#cbs.map(args => off(...args));
  }

  html(str) {
    template.innerHTML = str;
    walk(this, this, template.content.firstElementChild);

    return template.content.firstElementChild;
  }
}
