import { setupFixture } from '../testutils.js';

describe('if directive', () => {
  it('removes the :if attribute', () => {
    const { target } = setupFixture(
      `<div id="target" :if="true">hello</div>`
    );
    assert.isFalse(target.hasAttribute(':if'));
  });

  describe('adds the element', () => {
    it('when the value is true', () => {
      const { target } = setupFixture(
        `<div id="target" :if="true">hello</div>`
      );
      assert.isTrue(target.isConnected);
    });

    it('when the value is truthy', () => {
      const { target } = setupFixture(
        `<div id="target" :if="'two'">hello</div>`
      );
      assert.isTrue(target.isConnected);
    });

    it('when the expression is true', () => {
      const { target } = setupFixture(
        `<div id="target" :if="1 == true">hello</div>`
      );
      assert.isTrue(target.isConnected);
    });

    it('when the state is true', () => {
      const { target } = setupFixture(
        `<div id="target" :if="state.value">hello</div>`,
        {
          state: {
            value: true
          }
        }
      );
      assert.isTrue(target.isConnected);
    });

    it('when the negation state is true', () => {
      const { target } = setupFixture(
        `<div id="target" :if="!state.value">hello</div>`,
        {
          state: {
            value: false
          }
        }
      );
      assert.isTrue(target.isConnected);
    });

    it('when the binding changes', () => {
      const { host } = setupFixture(
        `<div id="target" :if="state.value">hello</div>`,
        {
          state: {
            value: false
          }
        },
        false
      );
      assert.notExists(host.querySelector('#target'));
      host.state.value = true;
      assert.exists(host.querySelector('#target'));
    });
  });

  describe('hides the element', () => {
    it('when the value is false', () => {
      const { host } = setupFixture(
        `<div id="target" :if="false">hello</div>`,
        {},
        false
      );
      assert.notExists(host.querySelector('#target'));
    });

    it('when the value is falsey', () => {
      const { host } = setupFixture(
        `<div id="target" :if="0">hello</div>`,
        {},
        false
      );
      assert.notExists(host.querySelector('#target'));
    });

    it('when the value is null', () => {
      const { host } = setupFixture(
        `<div id="target" :if="null">hello</div>`,
        {},
        false
      );
      assert.notExists(host.querySelector('#target'));
    });

    it('when the value is undefined', () => {
      const { host } = setupFixture(
        `<div id="target" :if="undefined">hello</div>`,
        {},
        false
      );
      assert.notExists(host.querySelector('#target'));
    });

    it('when the expression is false', () => {
      const { host } = setupFixture(
        `<div id="target" :if="1 == false">hello</div>`,
        {},
        false
      );
      assert.notExists(host.querySelector('#target'));
    });

    it('when the state is false', () => {
      const { host } = setupFixture(
        `<div id="target" :if="state.value">hello</div>`,
        {
          state: {
            value: false
          }
        },
        false
      );
      assert.notExists(host.querySelector('#target'));
    });

    it('when the negation state is false', () => {
      const { host } = setupFixture(
        `<div id="target" :if="!state.value">hello</div>`,
        {
          state: {
            value: true
          }
        },
        false
      );
      assert.notExists(host.querySelector('#target'));
    });

    it('when the binding changes', () => {
      const { target, host } = setupFixture(
        `<div id="target" :if="state.value">hello</div>`,
        {
          state: {
            value: true
          }
        },
        false
      );
      assert.isTrue(target.isConnected);
      host.state.value = false;
      assert.notExists(host.querySelector('#target'));
    });
  });

  describe('when the binding changes', () => {
    it('inserts the element into the correct place', () => {
      const { target, host } = setupFixture(
        `
        <div></div>
        <div></div>
        <div id="target" :if="state.value">hello</div>
        <div></div>
      `,
        {
          state: {
            value: false
          }
        },
        false
      );
      host.state.value = true;
      assert.isTrue(
        host.children[2] === host.querySelector('#target')
      );
    });

    it('inserts multiple elements into the correct place with multiple :if', () => {
      const { target, host } = setupFixture(
        `
        <div id="a" :if="state.a"></div>
        <div id="b" :if="state.b"></div>
        <div id="c" :if="state.c">hello</div>
        <div id="d" :if="state.d"></div>
      `,
        {
          state: {}
        },
        false
      );
      host.state.d = true;
      host.state.b = true;
      host.state.a = true;
      host.state.c = true;
      assert.isTrue(host.children[0] === host.querySelector('#a'));
      assert.isTrue(host.children[1] === host.querySelector('#b'));
      assert.isTrue(host.children[2] === host.querySelector('#c'));
      assert.isTrue(host.children[3] === host.querySelector('#d'));
    });

    it('works when setting to the same value twice', () => {
      const { host } = setupFixture(
        `<div id="target" :if="state.value">hello</div>`,
        {
          state: {
            value: false
          }
        },
        false
      );
      host.state.value = true;
      host.state.value = true;
      host.state.value = true;
      host.state.value = true;
      host.state.value = false;
      host.state.value = false;
      host.state.value = true;
      host.state.value = true;
      host.state.value = false;
      host.state.value = false;
      host.state.value = false;
      host.state.value = true;
      assert.exists(host.querySelector('#target'));
    });
  });

  describe('nested if', () => {
    it('processes bindings inside :if', () => {
      const { target } = setupFixture(
        `<span :if="true">
          <span>Hello</span>
          <span id="target" :foo="state.foo">{{ state.value }}</span>
        </span>`,
        {
          state: {
            foo: 'bar',
            value: 'hello'
          }
        }
      );
      assert.equal(target.getAttribute('foo'), 'bar');
      assert.equal(target.textContent, 'hello');
    });

    it('processes bindings inside :if even when not shown at first', () => {
      const { host } = setupFixture(
        `<span :if="state.if">
          <span>Hello</span>
          <span id="target" :foo="state.foo">{{ state.value }}</span>
        </span>`,
        {
          state: {
            if: false,
            foo: 'bar',
            value: 'hello'
          }
        },
        false
      );
      host.state.if = true;
      const target = host.querySelector('#target');
      assert.equal(target.getAttribute('foo'), 'bar');
      assert.equal(target.textContent, 'hello');
    });

    it('processes nested :if nodes', () => {
      const { target } = setupFixture(
        `<span :if="true">
          <span>Hello</span>
          <span :if="true">
            <span id="target" :foo="state.foo">{{ state.value }}</span>
          </span>
        </span>`,
        {
          state: {
            foo: 'bar',
            value: 'hello'
          }
        }
      );
      assert.equal(target.getAttribute('foo'), 'bar');
      assert.equal(target.textContent, 'hello');
    });

    it('processes nested :if nodes when inner is not shown first', () => {
      const { host } = setupFixture(
        `<span :if="true">
          <span>Hello</span>
          <span :if="state.if">
            <span id="target" :foo="state.foo">{{ state.value }}</span>
          </span>
        </span>`,
        {
          state: {
            if: false,
            foo: 'bar',
            value: 'hello'
          }
        },
        false
      );
      host.state.if = true;
      const target = host.querySelector('#target');
      assert.equal(target.getAttribute('foo'), 'bar');
      assert.equal(target.textContent, 'hello');
    });

    it('processes nested :if nodes when outer is not shown first', () => {
      const { host } = setupFixture(
        `<span :if="state.if">
          <span>Hello</span>
          <span :if="true">
            <span id="target" :foo="state.foo">{{ state.value }}</span>
          </span>
        </span>`,
        {
          state: {
            if: false,
            foo: 'bar',
            value: 'hello'
          }
        },
        false
      );
      host.state.if = true;
      const target = host.querySelector('#target');
      assert.equal(target.getAttribute('foo'), 'bar');
      assert.equal(target.textContent, 'hello');
    });

    it('processes nested :if nodes when both are not shown first (in order)', () => {
      const { host } = setupFixture(
        `<span :if="state.if">
          <span>Hello</span>
          <span :if="state.if2">
            <span id="target" :foo="state.foo">{{ state.value }}</span>
          </span>
        </span>`,
        {
          state: {
            if: false,
            if2: false,
            foo: 'bar',
            value: 'hello'
          }
        },
        false
      );
      host.state.if = true;
      host.state.if2 = true;
      const target = host.querySelector('#target');
      assert.equal(target.getAttribute('foo'), 'bar');
      assert.equal(target.textContent, 'hello');
    });

    it('processes nested :if nodes when both are not shown first (reverse order)', () => {
      const { host } = setupFixture(
        `<span :if="state.if">
          <span>Hello</span>
          <span :if="state.if2">
            <span id="target" :foo="state.foo">{{ state.value }}</span>
          </span>
        </span>`,
        {
          state: {
            if: false,
            if2: false,
            foo: 'bar',
            value: 'hello'
          }
        },
        false
      );
      host.state.if2 = true;
      host.state.if = true;
      const target = host.querySelector('#target');
      assert.equal(target.getAttribute('foo'), 'bar');
      assert.equal(target.textContent, 'hello');
    });
  });
});
