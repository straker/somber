import { setupFixture } from '../testutils.js';

describe('html directive', () => {
  it('removes the binding syntax', () => {
    const { target } = setupFixture(
      `<div id="target">{{{ true }}}</div>`
    );
    assert.isFalse(target.innerHTML.includes('{{{'));
  });

  describe('sets the text', () => {
    it('to value', () => {
      const { target } = setupFixture(
        `<div id="target">{{{ 'hello' }}}</div>`
      );
      assert.equal(target.innerHTML, 'hello');
    });

    it('to expression result', () => {
      const { target } = setupFixture(
        `<div id="target">{{{ true ? 1 : 0 }}}</div>`
      );
      assert.equal(target.innerHTML, '1');
    });

    it('to state', () => {
      const { target } = setupFixture(
        `<div id="target">{{{ value }}}</div>`,
        {
          value: '<span>world</span>'
        }
      );
      assert.equal(target.innerHTML, '<span>world</span>');
    });

    it('when the binding changes', () => {
      const { target, host } = setupFixture(
        `<div id="target">{{{ value }}}</div>`,
        {
          value: '<span>today</span>'
        }
      );
      assert.equal(target.innerHTML, '<span>today</span>');
      host.$data.value = '<i>tomorrow</i>';
      assert.equal(target.innerHTML, '<i>tomorrow</i>');
    });

    it('is white space insensitive', () => {
      const { target } = setupFixture(
        `<div id="target">  {{{true}}}  </div>`
      );
      assert.equal(target.innerHTML, 'true');
    });
  });

  describe('when the binding changes', () => {
    it('does not re-render the element', () => {
      const { target, host } = setupFixture(
        `<div id="target">{{{ value }}}</div>`,
        {
          value: true
        }
      );
      host.$data.value = false;
      assert.equal(target, host.querySelector('#target'));
    });
  });
});
