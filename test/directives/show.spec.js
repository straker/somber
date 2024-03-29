import { setupFixture } from '../testutils.js';

describe('show directive', () => {
  it('removes the :show attribute', () => {
    const { target } = setupFixture(
      `<div id="target" :show="true">hello</div>`
    );
    assert.isFalse(target.hasAttribute(':show'));
  });

  describe('shows the element', () => {
    it('when the value is true', () => {
      const { target } = setupFixture(
        `<div id="target" :show="true">hello</div>`
      );
      assert.isFalse(target.hasAttribute('hidden'));
    });

    it('when the value is truthy', () => {
      const { target } = setupFixture(
        `<div id="target" :show="'two'">hello</div>`
      );
      assert.isFalse(target.hasAttribute('hidden'));
    });

    it('when the expression is true', () => {
      const { target } = setupFixture(
        `<div id="target" :show="1 == true">hello</div>`
      );
      assert.isFalse(target.hasAttribute('hidden'));
    });

    it('when the state is true', () => {
      const { target } = setupFixture(
        `<div id="target" :show="state.value">hello</div>`,
        {
          state: {
            value: true
          }
        }
      );
      assert.isFalse(target.hasAttribute('hidden'));
    });

    it('when the negation state is true', () => {
      const { target } = setupFixture(
        `<div id="target" :show="!state.value">hello</div>`,
        {
          state: {
            value: false
          }
        }
      );
      assert.isFalse(target.hasAttribute('hidden'));
    });

    it('when the binding changes', () => {
      const { target, host } = setupFixture(
        `<div id="target" :show="state.value">hello</div>`,
        {
          state: {
            value: false
          }
        }
      );
      assert.isTrue(target.hasAttribute('hidden'));
      host.state.value = true;
      assert.isFalse(target.hasAttribute('hidden'));
    });
  });

  describe('hides the element', () => {
    it('when the value is false', () => {
      const { target } = setupFixture(
        `<div id="target" :show="false">hello</div>`
      );
      assert.isTrue(target.hasAttribute('hidden'));
    });

    it('when the value is falsey', () => {
      const { target } = setupFixture(
        `<div id="target" :show="0">hello</div>`
      );
      assert.isTrue(target.hasAttribute('hidden'));
    });

    it('when the value is null', () => {
      const { target } = setupFixture(
        `<div id="target" :show="null">hello</div>`
      );
      assert.isTrue(target.hasAttribute('hidden'));
    });

    it('when the value is undefined', () => {
      const { target } = setupFixture(
        `<div id="target" :show="undefined">hello</div>`
      );
      assert.isTrue(target.hasAttribute('hidden'));
    });

    it('when the expression is false', () => {
      const { target } = setupFixture(
        `<div id="target" :show="1 == false">hello</div>`
      );
      assert.isTrue(target.hasAttribute('hidden'));
    });

    it('when the state is false', () => {
      const { target } = setupFixture(
        `<div id="target" :show="state.value">hello</div>`,
        {
          state: {
            value: false
          }
        }
      );
      assert.isTrue(target.hasAttribute('hidden'));
    });

    it('when the negation state is false', () => {
      const { target } = setupFixture(
        `<div id="target" :show="!state.value">hello</div>`,
        {
          state: {
            value: true
          }
        }
      );
      assert.isTrue(target.hasAttribute('hidden'));
    });

    it('when the binding changes', () => {
      const { target, host } = setupFixture(
        `<div id="target" :show="state.value">hello</div>`,
        {
          state: {
            value: true
          }
        }
      );
      assert.isFalse(target.hasAttribute('hidden'));
      host.state.value = false;
      assert.isTrue(target.hasAttribute('hidden'));
    });
  });

  describe('when the binding changes', () => {
    it('does not re-render the element', () => {
      const { target, host } = setupFixture(
        `<div id="target" :show="state.value">hello</div>`,
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
});
