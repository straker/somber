import CustomElement from './src/custom-element.js';
import './custom-checkbox.js';

class AppRoot extends CustomElement {
  static observedAttributes = ['label', 'checked', 'foo'];

  constructor() {
    super()
    this.state = {
      label: 'foobar',
      thing: {
        foo: {
          bar: 'hi'
        }
      }
    }
  }

  render() {
    return this.html(`
      <form>
        <custom-checkbox :label="state"></custom-checkbox>
      </form>
    `);
  }
}

customElements.define('app-root', AppRoot);