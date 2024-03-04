import CustomElement from './src/custom-element.js';

class CustomCheckbox extends CustomElement {
  static observedAttributes = ['label'];

  constructor() {
    super()
    this.state.checked = true;
    this.bar = 10;
    console.log({...this })
  }

  render() {
    return this.html`<label>{{ props.label.label }} <input type="checkbox" :checked="state.checked"/></label>`
  }
}

customElements.define('custom-checkbox', CustomCheckbox);