import { setupFixture } from '../testutils.js';

describe('text directive', () => {
  it('removes the binding syntax', () => {
    const { target } = setupFixture(
      `<div id="target">{{ true }}</div>`
    );
    assert.isFalse(target.textContent.includes('{{'));
  });

  describe('sets the text', () => {
    it('to value', () => {
      const { target } = setupFixture(
        `<div id="target">{{ 'hello' }}</div>`
      );
      assert.equal(target.textContent, 'hello');
    });

    it('to expression result', () => {
      const { target } = setupFixture(
        `<div id="target">{{ true ? 1 : 0 }}</div>`
      );
      assert.equal(target.textContent, '1');
    });

    it('to state', () => {
      const { target } = setupFixture(
        `<div id="target">{{ state.value }}</div>`,
        {
          state: {
            value: 'world'
          }
        }
      );
      assert.equal(target.textContent, 'world');
    });

    it('to multiple bindings', () => {
      const { target } = setupFixture(
        `<div id="target">
          Hello {{ 'world' }}! How are you {{ 1 ? 'today' : 'tomorrow' }}?
        </div>`
      );
      assert.equal(
        target.textContent.trim(),
        'Hello world! How are you today?'
      );
    });

    it('when the binding changes', () => {
      const { target, host } = setupFixture(
        `<div id="target">
          Hello {{ state.name }}! How are you {{ state.value }}?
        </div>`,
        {
          state: {
            name: 'Bob',
            value: 'today'
          }
        }
      );
      assert.equal(
        target.textContent.trim(),
        'Hello Bob! How are you today?'
      );
      host.state.name = 'John';
      assert.equal(
        target.textContent.trim(),
        'Hello John! How are you today?'
      );
      host.state.value = 'tomorrow';
      assert.equal(
        target.textContent.trim(),
        'Hello John! How are you tomorrow?'
      );
    });

    it('is white space insensitive', () => {
      const { target } = setupFixture(
        `<div id="target">{{true}}</div>`
      );
      assert.equal(target.textContent, 'true');
    });
  });

  describe('when the binding changes', () => {
    it('does not re-render the element', () => {
      const { target, host } = setupFixture(
        `<div id="target">{{ state.value }}</div>`,
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
