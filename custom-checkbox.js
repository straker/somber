import CustomElement from './src/custom-element.js';

class CustomCheckbox extends CustomElement {
  static observedAttributes = ['label', 'data'];

  constructor() {
    super();
    this.state.checked = true;
  }

  render() {
    return this.html(
      `<div><p>{{ data.thing.foo.bar }}</p><label>{{ label }} <input type="checkbox" :checked="state.checked"/></label></div>`
    );
  }
}

customElements.define('custom-checkbox', CustomCheckbox);
