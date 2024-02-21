import CustomElement from '../../src/custom-element.js';
import { setupFixture, wait } from '../utils.js';

describe('bind directive', () => {
  it('removes the binding attribute', () => {
    const { target } = setupFixture(`<div id="target" :foo="true">hello</div>`);
    assert.isFalse(target.hasAttribute(':foo'));
  });

  describe('sets the attribute', () => {
    it('to value', () => {
      const { target } = setupFixture(`<div id="target" :foo="1">hello</div>`);
      assert.equal(target.getAttribute('foo'), '1');
    });

    it('to falsey value', () => {
      const { target } = setupFixture(`<div id="target" :foo="0">hello</div>`);
      assert.equal(target.getAttribute('foo'), '0');
    });

    it('to expression result', () => {
      const { target } = setupFixture(`<div id="target" :foo="true ? 'hello' : 'false'">hello</div>`);
      assert.equal(target.getAttribute('foo'), 'hello');
    });

    it('to state', () => {
      const { target } = setupFixture(`<div id="target" :foo="state.value">hello</div>`, {
        state: {
          value: 100
        }
      });
      assert.equal(target.getAttribute('foo'), '100');
    });

    it('to "" when true', () => {
      const { target } = setupFixture(`<div id="target" :foo="true">hello</div>`);
      assert.equal(target.getAttribute('foo'), '');
    });

    it('to "true" when aria-attribute is true', () => {
      const { target } = setupFixture(`<div id="target" :aria-foo="true">hello</div>`);
      assert.equal(target.getAttribute('aria-foo'), 'true');
    });

    it('to "false" when aria-attribute is false', () => {
      const { target } = setupFixture(`<div id="target" :aria-foo="false">hello</div>`);
      assert.equal(target.getAttribute('aria-foo'), 'false');
    });

    it('to "0" when aria-attribute is 0', () => {
      const { target } = setupFixture(`<div id="target" :aria-foo="0">hello</div>`);
      assert.equal(target.getAttribute('aria-foo'), '0');
    });

    it('when the binding changes', () => {
      const { target, host } = setupFixture(`<div id="target" :value="state.value">hello</div>`, {
        state: {
          value: 100
        }
      });
      assert.equal(target.getAttribute('value'), '100');
      host.state.value = -20;
      assert.equal(target.getAttribute('value'), '-20');
    });
  });

  describe('removes the attribute', () => {
    it('when false', () => {
      const { target } = setupFixture(`<div id="target" :foo="false">hello</div>`);
      assert.isFalse(target.hasAttribute('foo'));
    });

    it('when undefined', () => {
      const { target } = setupFixture(`<div id="target" :foo="undefined">hello</div>`);
      assert.isFalse(target.hasAttribute('foo'));
    });

    it('when null', () => {
      const { target } = setupFixture(`<div id="target" :foo="null">hello</div>`);
      assert.isFalse(target.hasAttribute('foo'));
    });

    it('when empty', () => {
      const { target } = setupFixture(`<div id="target" :foo="">hello</div>`);
      assert.isFalse(target.hasAttribute('foo'));
    });

    it('when expression is false', () => {
      const { target } = setupFixture(`<div id="target" :foo="!true">hello</div>`);
      assert.isFalse(target.hasAttribute('foo'));
    });

    it('when state is false', () => {
      const { target } = setupFixture(`<div id="target" :foo="state.value">hello</div>`, {
        state: {
          value: false
        }
      });
      assert.isFalse(target.hasAttribute('foo'));
    });

    it('when the binding changes', () => {
      const { target, host } = setupFixture(`<div id="target" :value="state.value">hello</div>`, {
        state: {
          value: 100
        }
      });
      assert.equal(target.getAttribute('value'), '100');
      host.state.value = false;
      assert.isFalse(target.hasAttribute('foo'));
    });
  });

  describe('when the binding changes', () => {
    it('does not re-render the element', () => {
      const { target, host } = setupFixture(`<div id="target" :foo="state.value">hello</div>`, {
        state: {
          value: true
        }
      });
      host.state.value = false;
      assert.equal(target, host.querySelector('#target'));
    });
  });
});