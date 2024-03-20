import SomberElement from '../../src/somber-element.js';
import { setupFixture } from '../testutils.js';

describe('bind directive', () => {
  it('removes the binding attribute', () => {
    const { target } = setupFixture(
      `<div id="target" :foo="true">hello</div>`
    );
    assert.isFalse(target.hasAttribute(':foo'));
  });

  describe('sets the attribute', () => {
    it('to value', () => {
      const { target } = setupFixture(
        `<div id="target" :foo="1">hello</div>`
      );
      assert.equal(target.getAttribute('foo'), '1');
    });

    it('to falsey value', () => {
      const { target } = setupFixture(
        `<div id="target" :foo="0">hello</div>`
      );
      assert.equal(target.getAttribute('foo'), '0');
    });

    it('to expression result', () => {
      const { target } = setupFixture(
        `<div id="target" :foo="true ? 'hello' : 'false'">hello</div>`
      );
      assert.equal(target.getAttribute('foo'), 'hello');
    });

    it('to state', () => {
      const { target } = setupFixture(
        `<div id="target" :foo="state.value">hello</div>`,
        {
          state: {
            value: 100
          }
        }
      );
      assert.equal(target.getAttribute('foo'), '100');
    });

    it('to "" when true', () => {
      const { target } = setupFixture(
        `<div id="target" :foo="true">hello</div>`
      );
      assert.equal(target.getAttribute('foo'), '');
    });

    it('to "true" when aria-attribute is true', () => {
      const { target } = setupFixture(
        `<div id="target" :aria-foo="true">hello</div>`
      );
      assert.equal(target.getAttribute('aria-foo'), 'true');
    });

    it('to "false" when aria-attribute is false', () => {
      const { target } = setupFixture(
        `<div id="target" :aria-foo="false">hello</div>`
      );
      assert.equal(target.getAttribute('aria-foo'), 'false');
    });

    it('to "0" when aria-attribute is 0', () => {
      const { target } = setupFixture(
        `<div id="target" :aria-foo="0">hello</div>`
      );
      assert.equal(target.getAttribute('aria-foo'), '0');
    });

    it('sets :key when not used with :for', () => {
      const { target } = setupFixture(
        `<div id="target" :key="1">hello</div>`
      );
      assert.equal(target.getAttribute('key'), '1');
    });

    it('when the binding changes', () => {
      const { target, host } = setupFixture(
        `<div id="target" :value="state.value">hello</div>`,
        {
          state: {
            value: 100
          }
        }
      );
      assert.equal(target.getAttribute('value'), '100');
      host.state.value = -20;
      assert.equal(target.getAttribute('value'), '-20');
    });
  });

  describe('removes the attribute', () => {
    it('when false', () => {
      const { target } = setupFixture(
        `<div id="target" :foo="false">hello</div>`
      );
      assert.isFalse(target.hasAttribute('foo'));
    });

    it('when undefined', () => {
      const { target } = setupFixture(
        `<div id="target" :foo="undefined">hello</div>`
      );
      assert.isFalse(target.hasAttribute('foo'));
    });

    it('when null', () => {
      const { target } = setupFixture(
        `<div id="target" :foo="null">hello</div>`
      );
      assert.isFalse(target.hasAttribute('foo'));
    });

    it('when empty', () => {
      const { target } = setupFixture(
        `<div id="target" :foo="">hello</div>`
      );
      assert.isFalse(target.hasAttribute('foo'));
    });

    it('when expression is false', () => {
      const { target } = setupFixture(
        `<div id="target" :foo="!true">hello</div>`
      );
      assert.isFalse(target.hasAttribute('foo'));
    });

    it('when state is false', () => {
      const { target } = setupFixture(
        `<div id="target" :foo="state.value">hello</div>`,
        {
          state: {
            value: false
          }
        }
      );
      assert.isFalse(target.hasAttribute('foo'));
    });

    it('when aria-attribute is null', () => {
      const { target } = setupFixture(
        `<div id="target" :aria-foo="null">hello</div>`
      );
      assert.isFalse(target.hasAttribute('aria-foo'));
    });

    it('when aria-attribute is undefined', () => {
      const { target } = setupFixture(
        `<div id="target" :aria-foo="undefined">hello</div>`
      );
      assert.isFalse(target.hasAttribute('aria-foo'));
    });

    it('when aria-attribute is ""', () => {
      const { target } = setupFixture(
        `<div id="target" :aria-foo="">hello</div>`
      );
      assert.isFalse(target.hasAttribute('aria-foo'));
    });

    it('when :key is used with :for', () => {
      const { target } = setupFixture(
        `<div id="target" :key="1" :for="item in state.items">
          <span></span>
        </div>`,
        {
          state: {
            items: []
          }
        }
      );
      assert.isFalse(target.hasAttribute('key'));
    });

    it('when the binding changes', () => {
      const { target, host } = setupFixture(
        `<div id="target" :value="state.value">hello</div>`,
        {
          state: {
            value: 100
          }
        }
      );
      assert.equal(target.getAttribute('value'), '100');
      host.state.value = false;
      assert.isFalse(target.hasAttribute('foo'));
    });
  });

  describe('when the binding changes', () => {
    it('does not re-render the element', () => {
      const { target, host } = setupFixture(
        `<div id="target" :foo="state.value">hello</div>`,
        {
          state: {
            value: true
          }
        }
      );
      host.state.value = false;
      assert.equal(target, host.querySelector('#target'));
    });
  });

  describe('class binding', () => {
    describe('sets the class', () => {
      it('when true', () => {
        const { target } = setupFixture(
          `<div id="target" :class="{ hello: true }">hello</div>`
        );
        assert.isTrue(target.classList.contains('hello'));
      });

      it('when expression is true', () => {
        const { target } = setupFixture(
          `<div id="target" :class="{ hello: true == 1 }">hello</div>`
        );
        assert.isTrue(target.classList.contains('hello'));
      });

      it('when expression is truthy', () => {
        const { target } = setupFixture(
          `<div id="target" :class="{ hello: 'foo' }">hello</div>`
        );
        assert.isTrue(target.classList.contains('hello'));
      });

      it('when state is true', () => {
        const { target } = setupFixture(
          `<div id="target" :class="{ hello: state.value }">hello</div>`,
          {
            state: {
              value: true
            }
          }
        );
        assert.isTrue(target.classList.contains('hello'));
      });

      it('when state is truthy', () => {
        const { target } = setupFixture(
          `<div id="target" :class="{ hello: state.value }">hello</div>`,
          {
            state: {
              value: 1
            }
          }
        );
        assert.isTrue(target.classList.contains('hello'));
      });

      it('when multiple properties are true', () => {
        const { target } = setupFixture(
          `<div id="target" :class="{ hello: 'foo', world: true }">hello</div>`
        );
        assert.isTrue(target.classList.contains('hello'));
        assert.isTrue(target.classList.contains('world'));
      });

      it('when some properties are true and some false', () => {
        const { target } = setupFixture(
          `<div
            id="target"
            :class="{ hello: 'foo', world: false, foo: 1 }"
          >hello</div>`
        );
        assert.isTrue(target.classList.contains('hello'));
        assert.isFalse(target.classList.contains('world'));
        assert.isTrue(target.classList.contains('foo'));
      });

      it('when the binding changes', () => {
        const { target, host } = setupFixture(
          `<div id="target" :class="{ hello: state.value }">hello</div>`,
          {
            state: {
              value: false
            }
          }
        );
        assert.isFalse(target.classList.contains('hello'));
        host.state.value = true;
        assert.isTrue(target.classList.contains('hello'));
      });

      it('does not remove static class values', () => {
        const { target } = setupFixture(
          `<div id="target" class="exists" :class="{ hello: true }">hello</div>`
        );
        assert.isTrue(target.classList.contains('exists'));
        assert.isTrue(target.classList.contains('hello'));
      });

      it('allows dynamic class names', () => {
        const { target } = setupFixture(
          `<div
            id="target"
            :class="{ hello: 'foo', [state.name]: true }"
          >hello</div>`,
          {
            state: {
              name: 'world'
            }
          }
        );
        assert.isTrue(target.classList.contains('hello'));
        assert.isTrue(target.classList.contains('world'));
      });

      it('allows white space in name', () => {
        const { target } = setupFixture(
          `<div id="target" :class="{ 'hello world': true }">hello</div>`
        );
        assert.isTrue(target.classList.contains('hello'));
        assert.isTrue(target.classList.contains('world'));
      });

      it('is white space insensitive', () => {
        const { target } = setupFixture(
          `<div id="target" :class="{ '   hello   ': true }">hello</div>`
        );
        assert.isTrue(target.classList.contains('hello'));
      });
    });

    describe('removes the class', () => {
      it('when false', () => {
        const { target } = setupFixture(
          `<div id="target" :class="{ hello: false }">hello</div>`
        );
        assert.isFalse(target.classList.contains('hello'));
      });

      it('when undefined', () => {
        const { target } = setupFixture(
          `<div id="target" :class="{ hello: undefined }">hello</div>`
        );
        assert.isFalse(target.classList.contains('hello'));
      });

      it('when null', () => {
        const { target } = setupFixture(
          `<div id="target" :class="{ hello: null }">hello</div>`
        );
        assert.isFalse(target.classList.contains('hello'));
      });

      it('when ""', () => {
        const { target } = setupFixture(
          `<div id="target" :class="{ hello: '' }">hello</div>`
        );
        assert.isFalse(target.classList.contains('hello'));
      });

      it('when expression is false', () => {
        const { target } = setupFixture(
          `<div id="target" :class="{ hello: false == 1 }">hello</div>`
        );
        assert.isFalse(target.classList.contains('hello'));
      });

      it('when expression is falsey', () => {
        const { target } = setupFixture(
          `<div id="target" :class="{ hello: true ? 0 : 1 }">hello</div>`
        );
        assert.isFalse(target.classList.contains('hello'));
      });

      it('when state is false', () => {
        const { target } = setupFixture(
          `<div id="target" :class="{ hello: state.value }">hello</div>`,
          {
            state: {
              value: false
            }
          }
        );
        assert.isFalse(target.classList.contains('hello'));
      });

      it('when state is falsey', () => {
        const { target } = setupFixture(
          `<div id="target" :class="{ hello: state.value }">hello</div>`,
          {
            state: {
              value: 0
            }
          }
        );
        assert.isFalse(target.classList.contains('hello'));
      });

      it('when multiple properties are false', () => {
        const { target } = setupFixture(
          `<div
            id="target"
            :class="{ hello: false, world: undefined }"
          >hello</div>`
        );
        assert.isFalse(target.classList.contains('hello'));
        assert.isFalse(target.classList.contains('world'));
      });

      it('when some properties are false and some true', () => {
        const { target } = setupFixture(
          `<div
            id="target"
            :class="{ hello: '', world: true, foo: false }"
          >hello</div>`
        );
        assert.isFalse(target.classList.contains('hello'));
        assert.isTrue(target.classList.contains('world'));
        assert.isFalse(target.classList.contains('foo'));
      });

      it('when the binding changes', () => {
        const { target, host } = setupFixture(
          `<div id="target" :class="{ hello: state.value }">hello</div>`,
          {
            state: {
              value: true
            }
          }
        );
        assert.isTrue(target.classList.contains('hello'));
        host.state.value = false;
        assert.isFalse(target.classList.contains('hello'));
      });

      it('does not remove static class values', () => {
        const { target } = setupFixture(
          `<div
            id="target"
            class="exists"
            :class="{ hello: false }"
          >hello</div>`
        );
        assert.isTrue(target.classList.contains('exists'));
      });

      it('removes static class values when same name', () => {
        const { target } = setupFixture(
          `<div
            id="target"
            class="exists"
            :class="{ exists: false }"
          >hello</div>`
        );
        assert.isFalse(target.classList.contains('exists'));
      });
    });
  });

  describe('style binding', () => {
    describe('sets the style', () => {
      it('to value', () => {
        const { target } = setupFixture(
          `<div id="target" :style="{ width: '100px' }">hello</div>`
        );
        assert.equal(target.style.width, '100px');
      });

      it('to falsey value', () => {
        const { target } = setupFixture(
          `<div id="target" :style="{ border: 0 }">hello</div>`
        );
        assert.equal(target.style.border, '0px');
      });

      it('to expression result', () => {
        const { target } = setupFixture(
          `<div
            id="target"
            :style="{ position: true ? 'relative' : 'false' }"
          >hello</div>`
        );
        assert.equal(target.style.position, 'relative');
      });

      it('to state', () => {
        const { target } = setupFixture(
          `<div id="target" :style="{ padding: state.value }">hello</div>`,
          {
            state: {
              value: '10px'
            }
          }
        );
        assert.equal(target.style.padding, '10px');
      });

      it('when multiple properties have values', () => {
        const { target } = setupFixture(
          `<div
            id="target"
            :style="{ border: '10px', 'font-size': '12px' }"
          >hello</div>`
        );
        assert.equal(target.style.border, '10px');
        assert.equal(target.style['font-size'], '12px');
      });

      it('when some properties are true and some false', () => {
        const { target } = setupFixture(
          `<div
            id="target"
            :style="{ border: '10px', padding: false, 'font-size': '12px' }"
          >hello</div>`
        );
        assert.equal(target.style.border, '10px');
        assert.equal(target.style.padding, '');
        assert.equal(target.style['font-size'], '12px');
      });

      it('when the binding changes', () => {
        const { target, host } = setupFixture(
          `<div id="target" :style="{ padding: state.value }">hello</div>`,
          {
            state: {
              value: false
            }
          }
        );
        assert.equal(target.style.padding, '');
        host.state.value = '4px';
        assert.equal(target.style.padding, '4px');
      });

      it('does not remove static style values', () => {
        const { target } = setupFixture(
          `<div
            id="target"
            style="padding: 2px"
            :style="{ border: 0 }"
          >hello</div>`
        );
        assert.equal(target.style.padding, '2px');
        assert.equal(target.style.border, '0px');
      });
    });

    describe('removes the style', () => {
      it('when false', () => {
        const { target } = setupFixture(
          `<div id="target" :style="{ width: false }">hello</div>`
        );
        assert.equal(target.style.width, '');
      });

      it('when undefined', () => {
        const { target } = setupFixture(
          `<div id="target" :style="{ width: undefined }">hello</div>`
        );
        assert.equal(target.style.width, '');
      });

      it('when null', () => {
        const { target } = setupFixture(
          `<div id="target" :style="{ width: null }">hello</div>`
        );
        assert.equal(target.style.width, '');
      });

      it('when ""', () => {
        const { target } = setupFixture(
          `<div id="target" :style="{ width: '' }">hello</div>`
        );
        assert.equal(target.style.width, '');
      });

      it('when expression is false', () => {
        const { target } = setupFixture(
          `<div id="target" :style="{ position: false === 1 }">hello</div>`
        );
        assert.equal(target.style.position, '');
      });

      it('when expression is falsey', () => {
        const { target } = setupFixture(
          `<div
            id="target"
            :style="{ 'line-height': true ? undefined : true }"
          >hello</div>`
        );
        assert.equal(target.style['line-height'], '');
      });

      it('when state is false', () => {
        const { target } = setupFixture(
          `<div id="target" :style="{ padding: state.value }">hello</div>`,
          {
            state: {
              value: false
            }
          }
        );
        assert.equal(target.style.padding, '');
      });

      it('when state is falsey', () => {
        const { target } = setupFixture(
          `<div id="target" :style="{ padding: state.value }">hello</div>`,
          {
            state: {}
          }
        );
        assert.equal(target.style.padding, '');
      });

      it('when multiple properties are false', () => {
        const { target } = setupFixture(
          `<div
            id="target"
            :style="{ border: '', 'font-size': null }"
          >hello</div>`
        );
        assert.equal(target.style.border, '');
        assert.equal(target.style['font-size'], '');
      });

      it('when some properties are false and some true', () => {
        const { target } = setupFixture(
          `<div
            id="target"
            :style="{ border: null, padding: '2px', 'font-size': false }"
          >hello</div>`
        );
        assert.equal(target.style.border, '');
        assert.equal(target.style.padding, '2px');
        assert.equal(target.style['font-size'], '');
      });

      it('when the binding changes', () => {
        const { target, host } = setupFixture(
          `<div id="target" :style="{ padding: state.value }">hello</div>`,
          {
            state: {
              value: '4px'
            }
          }
        );
        assert.equal(target.style.padding, '4px');
        host.state.value = 0;
        assert.equal(target.style.padding, '0px');
      });

      it('does not remove static style values', () => {
        const { target } = setupFixture(
          `<div
            id="target"
            style="padding: 2px"
            :style="{ border: 0 }"
          >hello</div>`
        );
        assert.equal(target.style.padding, '2px');
        assert.equal(target.style.border, '0px');
      });

      it('removes static style values when same name', () => {
        const { target } = setupFixture(
          `<div
            id="target"
            style="border: 10px"
            :style="{ border: false }"
          >hello</div>`
        );
        assert.equal(target.style.border, '');
      });
    });
  });

  describe('prop binding', () => {
    class PropComponent extends SomberElement {}
    customElements.define('prop-component', PropComponent);

    beforeEach(() => {
      PropComponent.observedAttributes = ['value'];
    });

    afterEach(() => {
      delete PropComponent.observedAttributes;
    });

    it('binds attribute to observed prop', () => {
      const { target } = setupFixture(
        `<prop-component id="target" :value="state.value">
        </prop-component>`,
        {
          state: {
            value: 'hello'
          }
        }
      );
      assert.equal(target.value, 'hello');
    });

    it('does not set attribute for observed prop', () => {
      const { target } = setupFixture(
        `<prop-component id="target" :value="state.value">
        </prop-component>`,
        {
          state: {
            value: 'hello'
          }
        }
      );
      assert.isFalse(target.hasAttribute('value'));
    });

    it('updates prop when binding changes', () => {
      const { target, host } = setupFixture(
        `<prop-component id="target" :value="state.value">
        </prop-component>`,
        {
          state: {
            value: 'hello'
          }
        }
      );
      host.state.value = 'goodbye';
      assert.equal(target.value, 'goodbye');
    });

    it('prevents setting prop', () => {
      const { target } = setupFixture(
        `<prop-component id="target" :value="state.value">
        </prop-component>`,
        {
          state: {
            value: 'hello'
          }
        }
      );
      target.value = 1;
      assert.equal(target.value, 'hello');
    });

    it('binds to attribute if prop is not observed', () => {
      const { target } = setupFixture(
        `<prop-component id="target" :aria-label="state.value">
        </prop-component>`,
        {
          state: {
            value: 'hello'
          }
        }
      );
      assert.equal(target.getAttribute('aria-label'), 'hello');
    });

    it('binds to attribute if element is not observing attributes', () => {
      delete PropComponent.observedAttributes;
      const { target } = setupFixture(
        `<prop-component id="target" :value="state.value">
        </prop-component>`,
        {
          state: {
            value: 'hello'
          }
        }
      );
      assert.equal(target.getAttribute('value'), 'hello');
    });

    it('binds to attribute if element is not a vue-lite component', () => {
      customElements.define(
        'normal-component',
        class NormalComponent extends HTMLElement {
          static observedAttributes = ['value'];
        }
      );
      const { target } = setupFixture(
        `<normal-component id="target" :value="state.value">
        </normal-component>`,
        {
          state: {
            value: 'hello'
          }
        }
      );
      assert.equal(target.getAttribute('value'), 'hello');
    });
  });
});
