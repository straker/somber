import CustomElement from '../src/custom-element.js';
import { getFixture } from './testutils.js';
import walk, { _directives } from '../src/walk.js';

describe('walk', () => {
  afterEach(() => {
    Object.values(_directives).forEach(value => {
      value.restore?.();
    });
  });

  it('calls event directive for @click', () => {
    const spy = sinon.spy(_directives, 'event');
    fixture.innerHTML = '<div id="target" @click="state.foo"></div>';
    walk(fixture, { state: { foo: 'bar' }}, fixture);
    assert.isTrue(spy.called);
  });

  it('calls event directive for @attribute', () => {
    const spy = sinon.spy(_directives, 'event');
    fixture.innerHTML = '<div id="target" @custom-event="state.foo"></div>';
    walk(fixture, { state: { foo: 'bar' }}, fixture);
    assert.isTrue(spy.called);
  });

  it('calls if directive for :if', () => {
    const spy = sinon.spy(_directives, 'if');
    fixture.innerHTML = '<div id="target" :if="state.foo"></div>';
    walk(fixture, { state: { foo: 'bar' }}, fixture);
    assert.isTrue(spy.called);
  });

  it('calls for directive for :for', () => {
    const spy = sinon.spy(_directives, 'for');
    fixture.innerHTML = '<div id="target" :for="item in state.foo"></div>';
    walk(fixture, { state: { foo: [] }}, fixture);
    assert.isTrue(spy.called);
  });

  it('calls bind directive for any attribute', () => {
    const spy = sinon.spy(_directives, 'bind');
    fixture.innerHTML = '<div id="target" :item="state.foo"></div>';
    walk(fixture, { state: { foo: 'bar' }}, fixture);
    assert.isTrue(spy.called);
  });

  it('calls bind directive for :key without :for', () => {
    const spy = sinon.spy(_directives, 'bind');
    fixture.innerHTML = '<div id="target" :key="state.foo"></div>';
    walk(fixture, { state: { foo: 'bar' }}, fixture);
    assert.isTrue(spy.called);
  });

  it('does not call bind directive for :key with :for (key first)', () => {
    const spy = sinon.spy(_directives, 'bind');
    fixture.innerHTML = '<div id="target" :key="index" :for="(item, index) in state.foo"></div>';
    walk(fixture, { state: { foo: [] }}, fixture);
    assert.isFalse(spy.called);
  });

  it('does not call bind directive for :key with :for (for first)', () => {
    const spy = sinon.spy(_directives, 'bind');
    fixture.innerHTML = '<div id="target" :for="(item, index) in state.foo" :key="index"></div>';
    walk(fixture, { state: { foo: [] }}, fixture);
    assert.isFalse(spy.called);
  });

  it('walks each attribute and calls the appropriate directive', () => {
    const bindSpy = sinon.spy(_directives, 'bind');
    const ifSpy = sinon.spy(_directives, 'if');
    const eventSpy = sinon.spy(_directives, 'event');
    fixture.innerHTML = '<div id="target" :foo="state.foo" :bar="state.foo" :baz="state.foo" :if="state.foo" @click="state.foo"></div>';
    walk(fixture, { state: { foo: 'bar' }}, fixture);
    assert.equal(bindSpy.callCount, 3);
    assert.equal(ifSpy.callCount, 1);
    assert.equal(eventSpy.callCount, 1);
  });

  it('ignores non-bound attributes', () => {
    const spy = sinon.spy(_directives, 'bind');
    fixture.innerHTML = '<div id="target" foo="state.foo"></div>';
    walk(fixture, { state: { foo: 'bar' }}, fixture);
    assert.isFalse(spy.called);
  });

  it('calls text directive', () => {
    const spy = sinon.spy(_directives, 'text');
    fixture.innerHTML = '<div id="target">{{ state.foo }}</div>';
    walk(fixture, { state: { foo: 'bar' }}, fixture);
    assert.isTrue(spy.called);
  });

  it('ignores non-bound text', () => {
    const spy = sinon.spy(_directives, 'text');
    fixture.innerHTML = '<div id="target">state.foo</div>';
    walk(fixture, { state: { foo: 'bar' }}, fixture);
    assert.isFalse(spy.called);
  });

  it('walks nested children', () => {
    const spy = sinon.spy(_directives, 'bind');
    fixture.innerHTML = '<div><div><div><div><div id="target" :item="state.foo"></div></div></div></div></div>';
    walk(fixture, { state: { foo: 'bar' }}, fixture);
    assert.isTrue(spy.called);
  });
});