import { getFixture } from './testutils.js';
import walk, { _directives } from '../src/walk.js';

describe('walk', () => {
  let fixture;
  before(() => {
    fixture = getFixture();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('calls event directive for @click', () => {
    const stub = sinon.stub(_directives, 'event');
    fixture.innerHTML = '<div id="target" @click="state.foo"></div>';
    const scope = { state: { foo: 'bar' } };
    const target = fixture.querySelector('#target');
    walk(fixture, scope, fixture);
    assert.isTrue(
      stub.calledWith(fixture, scope, target, 'click', 'state.foo')
    );
  });

  it('calls event directive for @attribute', () => {
    const stub = sinon.stub(_directives, 'event');
    fixture.innerHTML =
      '<div id="target" @custom-event="state.foo"></div>';
    const scope = { state: { foo: 'bar' } };
    const target = fixture.querySelector('#target');
    walk(fixture, scope, fixture);
    assert.isTrue(
      stub.calledWith(
        fixture,
        scope,
        target,
        'custom-event',
        'state.foo'
      )
    );
  });

  it('calls show directive for :show', () => {
    const stub = sinon.stub(_directives, 'show');
    fixture.innerHTML = '<div id="target" :show="state.foo"></div>';
    const scope = { state: { foo: 'bar' } };
    const target = fixture.querySelector('#target');
    walk(fixture, scope, fixture);
    assert.isTrue(
      stub.calledWith(fixture, scope, target, 'show', 'state.foo')
    );
  });

  it('calls show directive for :if', () => {
    const stub = sinon.stub(_directives, 'if');
    fixture.innerHTML = '<div id="target" :if="state.foo"></div>';
    const scope = { state: { foo: 'bar' } };
    const target = fixture.querySelector('#target');
    walk(fixture, scope, fixture);
    assert.isTrue(
      stub.calledWith(fixture, scope, target, 'if', 'state.foo')
    );
  });

  it('calls for directive for :for', () => {
    const stub = sinon.stub(_directives, 'for');
    fixture.innerHTML =
      '<div id="target" :for="item in state.foo"></div>';
    const scope = { state: { foo: [] } };
    const target = fixture.querySelector('#target');
    walk(fixture, scope, fixture);
    assert.isTrue(
      stub.calledWith(
        fixture,
        scope,
        target,
        'for',
        'item in state.foo'
      )
    );
  });

  it('calls bind directive for any attribute', () => {
    const stub = sinon.stub(_directives, 'bind');
    fixture.innerHTML = '<div id="target" :item="state.foo"></div>';
    const scope = { state: { foo: 'bar' } };
    const target = fixture.querySelector('#target');
    walk(fixture, scope, fixture);
    assert.isTrue(
      stub.calledWith(fixture, scope, target, 'item', 'state.foo')
    );
  });

  it('calls bind directive for :key without :for', () => {
    const stub = sinon.stub(_directives, 'bind');
    fixture.innerHTML = '<div id="target" :key="state.foo"></div>';
    const scope = { state: { foo: 'bar' } };
    const target = fixture.querySelector('#target');
    walk(fixture, scope, fixture);
    assert.isTrue(
      stub.calledWith(fixture, scope, target, 'key', 'state.foo')
    );
  });

  it('does not call bind directive for :key with :for (key first)', () => {
    const stub = sinon.stub(_directives, 'bind');
    sinon.stub(_directives, 'for');
    fixture.innerHTML =
      '<div id="target" :key="index" :for="(item, index) in state.foo"></div>';
    const scope = { state: { foo: [] } };
    walk(fixture, scope, fixture);
    assert.isFalse(stub.called);
  });

  it('does not call bind directive for :key with :for (for first)', () => {
    const stub = sinon.stub(_directives, 'bind');
    sinon.stub(_directives, 'for');
    fixture.innerHTML =
      '<div id="target" :for="(item, index) in state.foo" :key="index"></div>';
    const scope = { state: { foo: [] } };
    walk(fixture, scope, fixture);
    assert.isFalse(stub.called);
  });

  it('walks each attribute and calls the appropriate directive', () => {
    const bindstub = sinon.stub(_directives, 'bind');
    const showstub = sinon.stub(_directives, 'show');
    const ifstub = sinon.stub(_directives, 'if');
    const eventstub = sinon.stub(_directives, 'event');
    fixture.innerHTML =
      '<div id="target" :foo="state.foo" :bar="state.bar" :baz="state.baz" :show="state.show" :if="state.if" @click="state.click"></div>';
    const scope = {
      state: { foo: 1, bar: 2, baz: 3, show: 4, if: 5, click: 6 }
    };
    const target = fixture.querySelector('#target');
    walk(fixture, scope, fixture);

    assert.equal(bindstub.callCount, 3);
    assert.isTrue(
      bindstub
        .getCall(0)
        .calledWith(fixture, scope, target, 'foo', 'state.foo')
    );
    assert.isTrue(
      bindstub
        .getCall(1)
        .calledWith(fixture, scope, target, 'bar', 'state.bar')
    );
    assert.isTrue(
      bindstub
        .getCall(2)
        .calledWith(fixture, scope, target, 'baz', 'state.baz')
    );

    assert.equal(showstub.callCount, 1);
    assert.isTrue(
      showstub.calledWith(
        fixture,
        scope,
        target,
        'show',
        'state.show'
      )
    );

    assert.equal(ifstub.callCount, 1);
    assert.isTrue(
      ifstub.calledWith(fixture, scope, target, 'if', 'state.if')
    );

    assert.equal(eventstub.callCount, 1);
    assert.isTrue(
      eventstub.calledWith(
        fixture,
        scope,
        target,
        'click',
        'state.click'
      )
    );
  });

  it('ignores non-bound attributes', () => {
    const stub = sinon.stub(_directives, 'bind');
    fixture.innerHTML = '<div id="target" foo="state.foo"></div>';
    walk(fixture, { state: { foo: 'bar' } }, fixture);
    assert.isFalse(stub.called);
  });

  it('calls text directive', () => {
    const stub = sinon.stub(_directives, 'text');
    fixture.innerHTML = '<div id="target">{{ state.foo }}</div>';
    const scope = { state: { foo: 'bar' } };
    const target = fixture.querySelector('#target');
    walk(fixture, scope, fixture);
    assert.isTrue(
      stub.calledWith(
        fixture,
        scope,
        target.firstChild,
        '{{ state.foo }}'
      )
    );
  });

  it('calls html directive', () => {
    const stub = sinon.stub(_directives, 'html');
    fixture.innerHTML = '<div id="target">{{{ state.foo }}}</div>';
    const scope = { state: { foo: 'bar' } };
    const target = fixture.querySelector('#target');
    walk(fixture, scope, fixture);
    assert.isTrue(
      stub.calledWith(
        fixture,
        scope,
        target.firstChild,
        '{{{ state.foo }}}'
      )
    );
  });

  it('ignores non-bound text', () => {
    const textstub = sinon.stub(_directives, 'text');
    const htmlstub = sinon.stub(_directives, 'html');
    fixture.innerHTML = '<div id="target">state.foo</div>';
    walk(fixture, { state: { foo: 'bar' } }, fixture);
    assert.isFalse(textstub.called);
    assert.isFalse(htmlstub.called);
  });

  it('walks nested children', () => {
    const stub = sinon.stub(_directives, 'bind');
    fixture.innerHTML =
      '<div><div><div><div><div id="target" :item="state.foo"></div></div></div></div></div>';
    const scope = { state: { foo: 'bar' } };
    const target = fixture.querySelector('#target');
    walk(fixture, scope, fixture);
    assert.isTrue(
      stub.calledWith(fixture, scope, target, 'item', 'state.foo')
    );
  });

  it('does not process nodes twice', () => {
    const stub = sinon.stub(_directives, 'bind');
    fixture.innerHTML = '<div id="target" :item="state.foo"></div>';
    const scope = { state: { foo: 'bar' } };
    const target = fixture.querySelector('#target');
    walk(fixture, scope, fixture);
    target.setAttribute(':thing', 'state.foo');
    walk(fixture, scope, fixture);
    assert.isTrue(stub.calledOnce);
  });
});
