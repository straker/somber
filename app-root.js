import CustomElement from './src/custom-element.js';
import './custom-checkbox.js'; // must bring in first

class AppRoot extends CustomElement {
  static observedAttributes = ['label', 'checked', 'foo'];

  constructor() {
    super();
    this.state = {
      label: 'foobar',
      thing: {
        foo: {
          bar: 'hi'
        }
      }
    };
  }

  render() {
    return this.html(`
      <form>
        <custom-checkbox :label="state.label" :data="state"></custom-checkbox>
      </form>
    `);
  }
}

customElements.define('app-root', AppRoot);
