import { getFixture } from './testutils.js';
import walk, { _directives } from '../src/walk.js';

describe('walk', () => {
  let fixture;
  before(() => {
    fixture = getFixture();
  });

  afterEach(() => {
    Object.values(_directives).forEach(value => {
      value.restore?.();
    });
  });

  it('calls event directive for @click', () => {
    const spy = sinon.spy(_directives, 'event');
    fixture.innerHTML = '<div id="target" @click="state.foo"></div>';
    const scope = { state: { foo: 'bar' } };
    const target = fixture.querySelector('#target');
    walk(fixture, scope, fixture);
    assert.isTrue(
      spy.calledWith(fixture, scope, target, 'click', 'state.foo')
    );
  });

  it('calls event directive for @attribute', () => {
    const spy = sinon.spy(_directives, 'event');
    fixture.innerHTML =
      '<div id="target" @custom-event="state.foo"></div>';
    const scope = { state: { foo: 'bar' } };
    const target = fixture.querySelector('#target');
    walk(fixture, scope, fixture);
    assert.isTrue(
      spy.calledWith(
        fixture,
        scope,
        target,
        'custom-event',
        'state.foo'
      )
    );
  });

  it('calls show directive for :show', () => {
    const spy = sinon.spy(_directives, 'show');
    fixture.innerHTML = '<div id="target" :show="state.foo"></div>';
    const scope = { state: { foo: 'bar' } };
    const target = fixture.querySelector('#target');
    walk(fixture, scope, fixture);
    assert.isTrue(
      spy.calledWith(fixture, scope, target, 'show', 'state.foo')
    );
  });

  it('calls for directive for :for', () => {
    const spy = sinon.spy(_directives, 'for');
    fixture.innerHTML =
      '<div id="target" :for="item in state.foo"></div>';
    const scope = { state: { foo: [] } };
    const target = fixture.querySelector('#target');
    walk(fixture, scope, fixture);
    assert.isTrue(
      spy.calledWith(
        fixture,
        scope,
        target,
        'for',
        'item in state.foo'
      )
    );
  });

  it('calls bind directive for any attribute', () => {
    const spy = sinon.spy(_directives, 'bind');
    fixture.innerHTML = '<div id="target" :item="state.foo"></div>';
    const scope = { state: { foo: 'bar' } };
    const target = fixture.querySelector('#target');
    walk(fixture, scope, fixture);
    assert.isTrue(
      spy.calledWith(fixture, scope, target, 'item', 'state.foo')
    );
  });

  it('calls bind directive for :key without :for', () => {
    const spy = sinon.spy(_directives, 'bind');
    fixture.innerHTML = '<div id="target" :key="state.foo"></div>';
    const scope = { state: { foo: 'bar' } };
    const target = fixture.querySelector('#target');
    walk(fixture, scope, fixture);
    assert.isTrue(
      spy.calledWith(fixture, scope, target, 'key', 'state.foo')
    );
  });

  it('does not call bind directive for :key with :for (key first)', () => {
    const spy = sinon.spy(_directives, 'bind');
    fixture.innerHTML =
      '<div id="target" :key="index" :for="(item, index) in state.foo"></div>';
    const scope = { state: { foo: [] } };
    walk(fixture, scope, fixture);
    assert.isFalse(spy.called);
  });

  it('does not call bind directive for :key with :for (for first)', () => {
    const spy = sinon.spy(_directives, 'bind');
    fixture.innerHTML =
      '<div id="target" :for="(item, index) in state.foo" :key="index"></div>';
    const scope = { state: { foo: [] } };
    walk(fixture, scope, fixture);
    assert.isFalse(spy.called);
  });

  it('walks each attribute and calls the appropriate directive', () => {
    const bindSpy = sinon.spy(_directives, 'bind');
    const showSpy = sinon.spy(_directives, 'show');
    const ifSpy = sinon.spy(_directives, 'if');
    const eventSpy = sinon.spy(_directives, 'event');
    fixture.innerHTML =
      '<div id="target" :foo="state.foo" :bar="state.bar" :baz="state.baz" :show="state.show" :if="state.if" @click="state.click"></div>';
    const scope = {
      state: { foo: 1, bar: 2, baz: 3, show: 4, if: 5, click: 6 }
    };
    const target = fixture.querySelector('#target');
    walk(fixture, scope, fixture);

    assert.equal(bindSpy.callCount, 3);
    assert.isTrue(
      bindSpy
        .getCall(0)
        .calledWith(fixture, scope, target, 'foo', 'state.foo')
    );
    assert.isTrue(
      bindSpy
        .getCall(1)
        .calledWith(fixture, scope, target, 'bar', 'state.bar')
    );
    assert.isTrue(
      bindSpy
        .getCall(2)
        .calledWith(fixture, scope, target, 'baz', 'state.baz')
    );

    assert.equal(showSpy.callCount, 1);
    assert.isTrue(
      showSpy.calledWith(fixture, scope, target, 'show', 'state.show')
    );

    assert.equal(ifSpy.callCount, 1);
    assert.isTrue(
      ifSpy.calledWith(fixture, scope, target, 'if', 'state.if')
    );

    assert.equal(eventSpy.callCount, 1);
    assert.isTrue(
      eventSpy.calledWith(
        fixture,
        scope,
        target,
        'click',
        'state.click'
      )
    );
  });

  it('ignores non-bound attributes', () => {
    const spy = sinon.spy(_directives, 'bind');
    fixture.innerHTML = '<div id="target" foo="state.foo"></div>';
    walk(fixture, { state: { foo: 'bar' } }, fixture);
    assert.isFalse(spy.called);
  });

  it('calls text directive', () => {
    const spy = sinon.spy(_directives, 'text');
    fixture.innerHTML = '<div id="target">{{ state.foo }}</div>';
    const scope = { state: { foo: 'bar' } };
    const target = fixture.querySelector('#target');
    walk(fixture, scope, fixture);
    assert.isTrue(
      spy.calledWith(
        fixture,
        scope,
        target.firstChild,
        '{{ state.foo }}'
      )
    );
  });

  it('calls html directive', () => {
    const spy = sinon.spy(_directives, 'html');
    fixture.innerHTML = '<div id="target">{{{ state.foo }}}</div>';
    const scope = { state: { foo: 'bar' } };
    const target = fixture.querySelector('#target');
    walk(fixture, scope, fixture);
    assert.isTrue(
      spy.calledWith(
        fixture,
        scope,
        target.firstChild,
        '{{{ state.foo }}}'
      )
    );
  });

  it('ignores non-bound text', () => {
    const textSpy = sinon.spy(_directives, 'text');
    const htmlSpy = sinon.spy(_directives, 'html');
    fixture.innerHTML = '<div id="target">state.foo</div>';
    walk(fixture, { state: { foo: 'bar' } }, fixture);
    assert.isFalse(textSpy.called);
    assert.isFalse(htmlSpy.called);
  });

  it('walks nested children', () => {
    const spy = sinon.spy(_directives, 'bind');
    fixture.innerHTML =
      '<div><div><div><div><div id="target" :item="state.foo"></div></div></div></div></div>';
    const scope = { state: { foo: 'bar' } };
    const target = fixture.querySelector('#target');
    walk(fixture, scope, fixture);
    assert.isTrue(
      spy.calledWith(fixture, scope, target, 'item', 'state.foo')
    );
  });
});
