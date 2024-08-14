import watch from './watch.js';
import walk from './walk.js';
import { on, off } from './events.js';

const template = document.createElement('div');

/**
 * A SomberElement is a very thin Custom Element class that drives the reactive behavior.
 *
 *
 * ```js
 * customElements.define(
 *  'counter-button',
 *  class CounterButton extends SomberElement {
 *    constructor() {
 *      super();
 *      this.state.count = 0;
 *    }
 *
 *    render() {
 *      return this.html(`
 *        <button @click="state.count++">
 *          <span>Clicked {{ state.count }} time</span><span :show="state.count != 1">s</span>
 *         </button>
 *       `);
 *     }
 *   }
 * );
 * ```
 *
 * `static observedAttributes = ['label', 'checked', 'foo'];`
 *
 * @class SomberElement
 * @section SomberElement
 * @page SomberElement
 */
export default class SomberElement extends HTMLElement {
  #cbs = [];

  constructor(props = {}) {
    super();
    this.$data = props;
  }

  connectedCallback() {
    this.$data = watch(this.$data, this, '$data');

    // initialize attribute names so they exist even when
    // they are static attributes
    Array.from(this.attributes).map(({name, value}) => {
      this.$data[name] = value;
    });

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

  /**
   * Convert an HTML template string with bindings to HTML elements. Primarily used in the [render](/api/SomberElement#render) method to attach the HTML to the component.
   *
   * The template string can have one or more root nodes.
   *
   * ```js
   * // single root node
   * const singleRoot = this.html(`
   *   <button @click="clickHandler">Click</button>
   * `)[0];
   * }
   *
   * // multiple root nodes
   * const rootNodes = this.html(`
   *   <li>Trains</li>
   *   <li>Planes</li>
   *   <li>Automobiles</li>
   * `);
   * ```
   *
   * @memberof SomberElement
   * @function html
   * @page SomberElement
   *
   * @param {String} str - HTML template string.
   *
   * @returns {NodeList} List of the root nodes of the template string.
   */
  html(str) {
    template.innerHTML = str;
    Array.from(template.children).map(child => {
      walk(this, this, child);
    });

    return template.childNodes;
  }

  /**
   * Called when the component is mounted to the DOM and used to attach the components HTML. Must return a Array-like list of HTML elements.
   *
   * Typically you would call the [html](/api/SomberElement#html) method to setup the components HTML.
   *
   * ```js
   * render() {
   *   return this.html(`<div>Hello World</div>`);
   * }
   * ```
   *
   * @memberof SomberElement
   * @function render
   * @page SomberElement
   */
}
