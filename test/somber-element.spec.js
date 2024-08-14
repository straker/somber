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
    it('defines $data', () => {
      const host = document.createElement('custom-component');
      assert.exists(host.$data);
    });

    it('allows setting $data', () => {
      const host = document.createElement('custom-component');
      host.$data.value = 1;
      assert.equal(host.$data.value, 1);
    });
  });

  describe('connectedCallback', () => {
    it('watches $data for changes', () => {
      const host = document.createElement('custom-component');
      const $data = host.$data;
      fixture.appendChild(host);
      assert.notEqual($data, host.$data);
      assert.isTrue('__p' in host.$data);
    });

    it('calls render', () => {
      const host = document.createElement('custom-component');
      host.render = sinon
        .stub()
        .callsFake(() => [document.createElement('div')]);
      fixture.appendChild(host);
      assert.isTrue(host.render.called);
    });

    // TODO: it initializes attributes on $data
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

    it('allows multiple roots', () => {
      const host = document.createElement('custom-component');
      const dom = host.html(
        '<div id="one"></div><div id="two"></div>'
      );
      assert.equal(dom.length, 2);
    });

    it('walks the DOM and applies bindings', () => {
      const host = document.createElement('custom-component');
      host.$data.value = 1;
      const dom = host.html(`
        <div id="target" :foo="value">
          <div>
            <div>{{ value }}
          <div>
        </div>
      `);
      const node = Array.from(dom).find(node => node.getAttribute?.('id') === 'target');
      assert.equal(node.getAttribute('foo'), '1');
      assert.equal(node.textContent.trim(), '1');
    });

    it('walks the DOM for multiple roots', () => {
      const host = document.createElement('custom-component');
      host.$data.value = 1;
      const dom = host.html(`
        <div :foo="value">
          <div>
            <div>{{ value }}</div>
          </div>
        </div>
        <div id="target" :bar="value">
          <div>
            <div>Hello {{ value }}</div>
          </div>
        </div>
      `);
      const node = Array.from(dom).find(node => node.getAttribute?.('id') === 'target');
      assert.equal(node.getAttribute('bar'), '1');
      assert.equal(node.textContent.trim(), 'Hello 1');
    });
  });

  describe('props', () => {
    it('allows binding to props', () => {
      const { target } = setupFixture(
        `<custom-component id="target" :value="foo">`,
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
        `<custom-component id="target" :value="foo">`,
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
      host.$data.foo = 'hello';
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
      host.$data.foo.bar.baz = 'goodbye';
      assert.equal(
        target.querySelector('div').getAttribute('aria-label'),
        'goodbye'
      );
      assert.equal(target.textContent.trim(), 'goodbye');
    });
  });
});
