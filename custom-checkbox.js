import CustomElement from './src/custom-element.js';

class CustomCheckbox extends CustomElement {
  static observedAttributes = ['label', 'checked', 'foo'];

  constructor() {
    super()
    this.state.checked = undefined;
  }

  render() {
    const { label } = this.props;
    const { checked } = this.state;
    return this.html`<label>${label} <input type="checkbox" checked="${checked}" aria-hidden="${checked}"/></label>`
  }
}

customElements.define('custom-checkbox', CustomCheckbox);