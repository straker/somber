import SomberElement from '../src/somber-element.js';
import { getFixture, setupFixture } from './testutils.js';
import { _callbacks } from '../src/events.js';

describe('SomberElement', () => {
  class CustomComponent extends SomberElement {
    static observedAttributes = ['value'];
  }
  customElements.define('custom-component', CustomComponent);

  let fixture;
  before(() => {
    fixture = getFixture();
  });

  describe('constructor', () => {
    it('defines state', () => {
      const host = document.createElement('custom-component');
      assert.exists(host.state);
    });

    it('allows setting state', () => {
      const host = document.createElement('custom-component');
      host.state.value = 1;
      assert.equal(host.state.value, 1);
    });
  });

  describe('connectedCallback', () => {
    it('watches state for changes', () => {
      const host = document.createElement('custom-component');
      const state = host.state;
      fixture.appendChild(host);
      assert.notEqual(state, host.state);
      assert.isTrue('__p' in host.state);
    });

    it('calls render', () => {
      const host = document.createElement('custom-component');
      const state = host.state;
      host.render = sinon
        .stub()
        .callsFake(() => [document.createElement('div')]);
      fixture.appendChild(host);
      assert.isTrue(host.render.called);
    });
  });

  describe('on', () => {
    it('adds the callback to the callbacks object', () => {
      const host = document.createElement('custom-component');
      const cb = sinon.spy();
      const obj = {
        foo: 'bar'
      };
      host.on(obj, 'foo', cb);
      assert.isTrue(_callbacks.has(obj));
      assert.deepEqual(_callbacks.get(obj).foo, [cb]);
    });
  });

  describe('disconnectedCallback', () => {
    it('removes the callback from the callbacks object', () => {
      const host = document.createElement('custom-component');
      const cb = sinon.spy();
      const obj = {
        foo: 'bar'
      };
      host.on(obj, 'foo', cb);
      fixture.appendChild(host);
      host.remove();
      assert.isFalse(_callbacks.has(obj));
    });
  });

  describe('html', () => {
    it('returns the string as DOM array', () => {
      const host = document.createElement('custom-component');
      const dom = host.html('<div id="one"></div>');
      assert.equal(dom.length, 1);
      assert.isTrue(dom[0] instanceof HTMLElement);
      assert.equal(dom[0].nodeName, 'DIV');
    });

    it('walks the DOM and applies bindings', () => {
      const host = document.createElement('custom-component');
      host.state.value = 1;
      const dom = host.html(`
        <div :foo="state.value">
          <div>
            <div>{{ state.value }}
          <div>
        </div>
      `)[1]; // due to whitespace first node is text
      assert.equal(dom.getAttribute('foo'), '1');
      assert.equal(dom.textContent.trim(), '1');
    });
  });

  describe('props', () => {
    it('allows binding to props', () => {
      const { target } = setupFixture(
        `<custom-component id="target" :value="state.foo">`,
        {
          state: {
            foo: 'bar'
          }
        }
      );
      target.append(
        ...target.html(`
        <div :aria-label="value">
          <span>{{ value }}</span>
        </div>
      `)
      );
      assert.equal(
        target.querySelector('div').getAttribute('aria-label'),
        'bar'
      );
      assert.equal(target.textContent.trim(), 'bar');
    });

    it('updates bindings when prop changes', () => {
      const { target, host } = setupFixture(
        `<custom-component id="target" :value="state.foo">`,
        {
          state: {
            foo: 'bar'
          }
        }
      );
      target.append(
        ...target.html(`
        <div :aria-label="value">
          <span>{{ value }}</span>
        </div>
      `)
      );
      host.state.foo = 'hello';
      assert.equal(
        target.querySelector('div').getAttribute('aria-label'),
        'hello'
      );
      assert.equal(target.textContent.trim(), 'hello');
    });

    it('allows props of static objects', () => {
      const { target } = setupFixture(
        `<custom-component id="target" :value="{ foo: { bar: { baz: 'hello' }}}">`
      );
      target.append(
        ...target.html(`
        <div :aria-label="value.foo.bar.baz">
          <span>{{ value.foo.bar.baz }}</span>
        </div>
      `)
      );
      assert.equal(
        target.querySelector('div').getAttribute('aria-label'),
        'hello'
      );
      assert.equal(target.textContent.trim(), 'hello');
    });

    it('allows props of bound objects', () => {
      const { target } = setupFixture(
        `<custom-component id="target" :value="state">`,
        {
          state: {
            foo: {
              bar: {
                baz: 'hello'
              }
            }
          }
        }
      );
      target.append(
        ...target.html(`
        <div :aria-label="value.foo.bar.baz">
          <span>{{ value.foo.bar.baz }}</span>
        </div>
      `)
      );
      assert.equal(
        target.querySelector('div').getAttribute('aria-label'),
        'hello'
      );
      assert.equal(target.textContent.trim(), 'hello');
    });

    it('updates bindings when object props changes', () => {
      const { target, host } = setupFixture(
        `<custom-component id="target" :value="state">`,
        {
          state: {
            foo: {
              bar: {
                baz: 'hello'
              }
            }
          }
        }
      );
      target.append(
        ...target.html(`
        <div :aria-label="value.foo.bar.baz">
          <span>{{ value.foo.bar.baz }}</span>
        </div>
      `)
      );
      host.state.foo.bar.baz = 'goodbye';
      assert.equal(
        target.querySelector('div').getAttribute('aria-label'),
        'goodbye'
      );
      assert.equal(target.textContent.trim(), 'goodbye');
    });
  });
});
