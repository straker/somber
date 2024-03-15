import CustomElement from './src/custom-element.js';

class CustomCheckbox extends CustomElement {
  static observedAttributes = ['label', 'data'];

  constructor() {
    super();
    this.state.checked = true;
    // this.state.value = 'hello';
    // this.state.text = 'hello';
    this.state.selected = 'four';
  }

  render() {
    return this.html(
      `<div>
        <p>{{ data.thing.foo.bar }}</p>
        <label>
          {{ label }}
          <input type="checkbox" :checked="state.checked"
      :model="state.checked"/>
        </label>
        <p>Checked: {{ state.checked }}</p>
        <input :model="state.value"/>
        <p>Value: {{ state.value }}</p>
        <textarea :model="state.text"></textarea>
        <p style="white-space: pre-line;">Text: {{ state.text }}</p>
        <select :model="state.selected">
          <option>one</option>
          <option>two</option>
          <option>three</option>
        </select>
        <p>Selected {{ state.selected }}</p>
      </div>
    `
    );
  }
}

customElements.define('custom-checkbox', CustomCheckbox);
