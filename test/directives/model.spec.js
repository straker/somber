import { setupFixture } from '../testutils.js';
import { on } from '../../src/events.js';

describe('model directive', () => {
  it('removes the binding attribute', () => {
    const { target } = setupFixture(
      `<input id="target" :model="true"/>`
    );
    assert.isFalse(target.hasAttribute(':model'));
  });

  describe('input[type="text"]', () => {
    it('sets the value to empty string if model is null', () => {
      const { target } = setupFixture(
        `<input id="target" :model="state.value"/>`,
        {
          state: {
            value: null
          }
        }
      );
      assert.equal(target.value, '');
    });

    it('sets the value to empty string if model is undefined', () => {
      const { target } = setupFixture(
        `<input id="target" :model="state.value"/>`,
        {
          state: {
            value: undefined
          }
        }
      );
      assert.equal(target.value, '');
    });

    it('sets the value', () => {
      const { target } = setupFixture(
        `<input id="target" :model="state.value"/>`,
        {
          state: {
            value: 'hello'
          }
        }
      );
      assert.equal(target.value, 'hello');
    });

    it('updates the value on input event', () => {
      const { target, host } = setupFixture(
        `<input id="target" :model="state.value"/>`
      );
      target.value = 'hello';
      target.dispatchEvent(new Event('input'));
      assert.equal(host.state.value, 'hello');
    });

    it('emits when value changes', done => {
      const scope = {
        state: {
          value: ''
        }
      };
      const { target, host } = setupFixture(
        `<input id="target" :model="state.value"/>`,
        scope
      );
      on(scope.state, 'value', () => {
        done();
      });
      target.value = 'hello';
      target.dispatchEvent(new Event('input'));
      done(new Error('emit not called'));
    });
  });

  describe('textarea', () => {
    it('sets the value to empty string if model is null', () => {
      const { target } = setupFixture(
        `<textarea id="target" :model="state.value"></textarea>`,
        {
          state: {
            value: null
          }
        }
      );
      assert.equal(target.value, '');
    });

    it('sets the value to empty string if model is undefined', () => {
      const { target } = setupFixture(
        `<textarea id="target" :model="state.value"></textarea>`,
        {
          state: {
            value: undefined
          }
        }
      );
      assert.equal(target.value, '');
    });

    it('sets the value', () => {
      const { target } = setupFixture(
        `<textarea id="target" :model="state.value"></textarea>`,
        {
          state: {
            value: 'hello'
          }
        }
      );
      assert.equal(target.value, 'hello');
    });

    it('updates the value on input event', () => {
      const { target, host } = setupFixture(
        `<textarea id="target" :model="state.value"></textarea>`
      );
      target.value = 'hello';
      target.dispatchEvent(new Event('input'));
      assert.equal(host.state.value, 'hello');
    });

    it('emits when value changes', done => {
      const scope = {
        state: {
          value: ''
        }
      };
      const { target, host } = setupFixture(
        `<textarea id="target" :model="state.value"></textarea>`,
        scope
      );
      on(scope.state, 'value', () => {
        done();
      });
      target.value = 'hello';
      target.dispatchEvent(new Event('input'));
      done(new Error('emit not called'));
    });
  });

  describe('input[type="checkbox"]', () => {
    it('does not set checked state if model is null', () => {
      const { target } = setupFixture(
        `<input type="checkbox" id="target" :model="state.value"/>`,
        {
          state: {
            value: null
          }
        }
      );
      assert.equal(target.checked, false);
    });

    it('does not set checked state if model is undefined', () => {
      const { target } = setupFixture(
        `<input type="checkbox" id="target" :model="state.value"/>`,
        {
          state: {
            value: undefined
          }
        }
      );
      assert.equal(target.checked, false);
    });

    it('sets the value', () => {
      const { target } = setupFixture(
        `<input type="checkbox" id="target" :model="state.value"/>`,
        {
          state: {
            value: true
          }
        }
      );
      assert.equal(target.checked, true);
    });

    it('updates the value on change event', () => {
      const { target, host } = setupFixture(
        `<input type="checkbox" id="target" :model="state.value"/>`
      );
      target.checked = true;
      target.dispatchEvent(new Event('change'));
      assert.equal(host.state.value, true);
    });

    it('emits when value changes', done => {
      const scope = {
        state: {
          value: ''
        }
      };
      const { target, host } = setupFixture(
        `<input type="checkbox" id="target" :model="state.value"/>`,
        scope
      );
      on(scope.state, 'value', () => {
        done();
      });
      target.checked = true;
      target.dispatchEvent(new Event('change'));
      done(new Error('emit not called'));
    });
  });

  describe('input[type="radio"]', () => {
    it('does not set checked state if model is null', () => {
      const { target } = setupFixture(
        `<input type="radio" id="target" :model="state.value"/>`,
        {
          state: {
            value: null
          }
        }
      );
      assert.equal(target.checked, false);
    });

    it('does not set checked state if model is undefined', () => {
      const { target } = setupFixture(
        `<input type="radio" id="target" :model="state.value"/>`,
        {
          state: {
            value: undefined
          }
        }
      );
      assert.equal(target.checked, false);
    });

    it('sets the value', () => {
      const { target } = setupFixture(
        `<input type="radio" id="target" :model="state.value"/>`,
        {
          state: {
            value: true
          }
        }
      );
      assert.equal(target.checked, true);
    });

    it('updates the value on change event', () => {
      const { target, host } = setupFixture(
        `<input type="radio" id="target" :model="state.value"/>`
      );
      target.checked = true;
      target.dispatchEvent(new Event('change'));
      assert.equal(host.state.value, true);
    });

    it('emits when value changes', done => {
      const scope = {
        state: {
          value: ''
        }
      };
      const { target, host } = setupFixture(
        `<input type="radio" id="target" :model="state.value"/>`,
        scope
      );
      on(scope.state, 'value', () => {
        done();
      });
      target.checked = true;
      target.dispatchEvent(new Event('change'));
      done(new Error('emit not called'));
    });
  });

  describe('select', () => {
    it('sets the value to first option if model is null', () => {
      const { target } = setupFixture(
        `
        <select id="target" :model="state.value"/>
          <option>one</option>
          <option>two</option>
        </select>
        `,
        {
          state: {
            value: null
          }
        }
      );
      assert.equal(target.value, 'one');
    });

    it('sets the value to first option if model is undefined', () => {
      const { target } = setupFixture(
        `
        <select id="target" :model="state.value"/>
          <option>one</option>
          <option>two</option>
        </select>
        `,
        {
          state: {
            value: undefined
          }
        }
      );
      assert.equal(target.value, 'one');
    });

    it('sets the value to empty string if model is not an option', () => {
      const { target } = setupFixture(
        `
        <select id="target" :model="state.value"/>
          <option>one</option>
          <option>two</option>
        </select>
        `,
        {
          state: {
            value: 'three'
          }
        }
      );
      assert.equal(target.value, '');
    });

    it('sets the value', () => {
      const { target } = setupFixture(
        `
        <select id="target" :model="state.value"/>
          <option>one</option>
          <option>two</option>
        </select>
        `,
        {
          state: {
            value: 'two'
          }
        }
      );
      assert.equal(target.value, 'two');
    });

    it('updates the value on change event', () => {
      const { target, host } = setupFixture(`
        <select id="target" :model="state.value"/>
          <option>one</option>
          <option>two</option>
        </select>
      `);
      target.value = 'two';
      target.dispatchEvent(new Event('change'));
      assert.equal(host.state.value, 'two');
    });

    it('emits when value changes', done => {
      const scope = {
        state: {
          value: ''
        }
      };
      const { target, host } = setupFixture(
        `
        <select id="target" :model="state.value"/>
          <option>one</option>
          <option>two</option>
        </select>
      `,
        scope
      );
      on(scope.state, 'value', () => {
        done();
      });
      target.value = 'two';
      target.dispatchEvent(new Event('change'));
      done(new Error('emit not called'));
    });
  });
});
