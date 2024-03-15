import CustomElement from '../src/custom-element.js';
import { getFixture } from './testutils.js';
import { _callbacks } from '../src/events.js';

describe('CustomElement', () => {
  customElements.define(
    'custom-component',
    class CustomComponent extends CustomElement {}
  );

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
        .callsFake(() => document.createElement('div'));
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
    it('returns the string as DOM', () => {
      const host = document.createElement('custom-component');
      const dom = host.html('<div id="one"></div>');
      assert.isTrue(dom instanceof HTMLElement);
      assert.equal(dom.nodeName, 'DIV');
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
      `);
      assert.equal(dom.getAttribute('foo'), '1');
      assert.equal(dom.textContent.trim(), '1');
    });
  });
});
