import CustomElement from '../../src/custom-element.js';
import { setupFixture, wait } from '../utils.js';

describe('event directive', () => {
  it('removes the binding attribute', () => {
    const { target } = setupFixture(`<button id="target" @click="doThis">hello</button>`, {
      doThis() {}
    });
    assert.isFalse(target.hasAttribute('@click'));
  });

  it('calls the function when the event is triggered', () => {
    const spy = sinon.spy();
    const { target } = setupFixture(`<button id="target" @click="doThis">hello</button>`, {
      doThis: spy
    });
    target.click();
    assert.isTrue(spy.called);
  });

  it('passes the event to the function', () => {
    const spy = sinon.spy();
    const { target } = setupFixture(`<button id="target" @click="doThis">hello</button>`, {
      doThis: spy
    });
    target.click();
    assert.isTrue(spy.args[0][0] instanceof Event);
  });

  it('allows $event in expression', () => {
    const spy = sinon.spy();
    const { target } = setupFixture(`<button id="target" @click="doThis($event)">hello</button>`, {
      doThis: spy
    });
    target.click();
    assert.isTrue(spy.args[0][0] instanceof Event);
  });

  it('works with custom events', () => {
    const spy = sinon.spy();
    const { target } = setupFixture(`<button id="target" @my-event="doThis">hello</button>`, {
      doThis: spy
    });
    target.dispatchEvent(new CustomEvent('my-event'));
    assert.isTrue(spy.called);
  });
});