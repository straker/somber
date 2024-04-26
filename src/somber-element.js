import watch from './watch.js';
import walk from './walk.js';
import { on, off } from './events.js';

const template = document.createElement('div');

export default class SomberElement extends HTMLElement {
  #cbs = [];

  constructor() {
    super();
    this.state = {};
  }

  connectedCallback() {
    this.state = watch(this.state);

    if (this.render) {
      this.append(...this.render());
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
    walk(this, this, template.firstElementChild);

    return template.childNodes;
  }
}
