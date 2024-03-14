import { on, off, emit, _callbacks } from '../src/events.js';

describe('events', () => {
  describe('on', () => {
    it('adds callback to the callback object', () => {
      const cb = {};
      const obj = {
        foo: 'bar'
      };
      on(obj, 'foo', cb);
      assert.isTrue(_callbacks.has(obj));
      assert.deepEqual(_callbacks.get(obj).foo, [cb]);
    });

    it('adds multiple callbacks to the same key', () => {
      const cb1 = {};
      const cb2 = {};
      const obj = {
        foo: 'bar'
      };
      on(obj, 'foo', cb1);
      on(obj, 'foo', cb2);
      assert.deepEqual(_callbacks.get(obj).foo, [cb1, cb2]);
    });
  });

  describe('emit', () => {
    it('calls the callback', () => {
      const cb = sinon.spy();
      const obj = {
        foo: 'bar'
      };
      on(obj, 'foo', cb);
      emit(obj, 'foo');
      assert.isTrue(cb.called);
    });

    it('calls multiple callbacks', () => {
      const cb1 = sinon.spy();
      const cb2 = sinon.spy();
      const obj = {
        foo: 'bar'
      };
      on(obj, 'foo', cb1);
      on(obj, 'foo', cb2);
      emit(obj, 'foo');
      assert.isTrue(cb1.called);
      assert.isTrue(cb2.called);
    });

    it('passes all parameters to the callback', () => {
      const cb = sinon.spy();
      const obj = {
        foo: 'bar'
      };
      on(obj, 'foo', cb);
      emit(obj, 'foo', 1, 2, 3);
      assert.isTrue(cb.calledWith(1, 2, 3));
    });

    it('calls emit for each ancestor', () => {
      const cb1 = sinon.spy();
      const cb2 = sinon.spy();
      const obj = {};
      const child = {};
      const grandchild = {
        foo: 'bar'
      };

      grandchild.__p = { obj: child, key: 'baz' };
      child.baz = grandchild;
      child.__p = { obj, key: 'thing' };
      obj.thing = child;

      on(obj, 'thing', cb1);
      on(child, 'baz', cb2);
      emit(grandchild, 'foo');

      assert.isTrue(cb1.called);
      assert.isTrue(cb2.called);
    });
  });

  describe('off', () => {
    it("does nothing if callback doesn't exist", () => {
      assert.doesNotThrow(() => {
        off({}, 'foo');
      });
    });

    it('removes callback', () => {
      const cb1 = {};
      const cb2 = {};
      const obj = {
        foo: 'bar'
      };
      on(obj, 'foo', cb1);
      on(obj, 'foo', cb2);
      assert.deepEqual(_callbacks.get(obj).foo, [cb1, cb2]);
      off(obj, 'foo', cb1);
      assert.deepEqual(_callbacks.get(obj).foo, [cb2]);
    });

    it('removes the callback key when empty', () => {
      const cb1 = {};
      const cb2 = {};
      const obj = {
        foo: 'bar'
      };
      on(obj, 'foo', cb1);
      on(obj, 'bar', cb2);
      assert.deepEqual(_callbacks.get(obj).foo, [cb1]);
      off(obj, 'foo', cb1);
      assert.isUndefined(_callbacks.get(obj).foo);
    });

    it('removes the obj when it has no more keys', () => {
      const cb = {};
      const obj = {
        foo: 'bar'
      };
      on(obj, 'foo', cb);
      assert.deepEqual(_callbacks.get(obj).foo, [cb]);
      off(obj, 'foo', cb);
      assert.isFalse(_callbacks.has(obj));
    });
  });
});
