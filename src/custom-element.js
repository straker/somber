import { watchObject } from './watcher.js';
import walk from './walk.js';
import { on, off } from './events.js';

const template = document.createElement('template');

export default class CustomElement extends HTMLElement {
  constructor() {
    super()
    this.state = {};
    this.props ??= {};
    this._cbs = [];
  }

  connectedCallback() {
    this.state = watchObject(this.state);
    this.props = watchObject(this.props);
    this.appendChild(this.render());
  }

  on(obj, key, callback) {
    on(obj, key, callback);
    this._cbs.push([obj, key, callback]);
  }

  disconnectedCallback() {
    this._cbs.map(args => off(...args));
  }

  // attributeChangedCallback(name, oldValue, value) {
  //   this.dispatchEvent(new CustomEvent('props.' + name));
  // }

  html(str) {
    template.innerHTML = str;
    walk(this, this, template.content.firstElementChild);

    return template.content.firstElementChild;
  }
}
window.CustomElement = CustomElement;