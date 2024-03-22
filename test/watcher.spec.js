import {
  watch,
  accessedPaths,
  startWatchingPaths,
  stopWatchingPaths
} from '../src/watcher.js';
import { on } from '../src/events.js';

describe('watcher', () => {
  describe('watch', () => {
    it('wraps the object in a proxy', () => {
      const obj = {};
      const proxy = watch(obj);
      assert.notEqual(obj, proxy);
      assert.isTrue('__p' in proxy);
    });

    it('returns the value at key', () => {
      const obj = {
        foo: 'bar'
      };
      const proxy = watch(obj);
      assert.equal(proxy.foo, 'bar');
    });

    it('sets the value at key', () => {
      const obj = {
        foo: 'bar'
      };
      const proxy = watch(obj);
      proxy.foo = 'hello';
      assert.equal(proxy.foo, 'hello');
    });

    it('watches nested objects', () => {
      const obj = {
        foo: {
          bar: {
            baz: 'hello'
          }
        }
      };
      const proxy = watch(obj);
      assert.isTrue('__p' in proxy.foo);
      assert.isTrue('__p' in proxy.foo.bar);
    });

    it('watches nested objects when set', () => {
      const obj = {};
      const proxy = watch(obj);
      proxy.foo = { hello: 'world' };
      assert.isTrue('__p' in proxy.foo);
    });

    it('emits when value changes', done => {
      const obj = {
        foo: 'bar'
      };
      const proxy = watch(obj);
      on(obj, 'foo', () => {
        done();
      });
      proxy.foo = 'hello';
      done(new Error('emit not called'));
    });

    it('returns itself if already watched object', () => {
      const obj = {
        foo: 'bar'
      };
      const proxy = watch(obj);
      const proxy2 = watch(proxy);
      assert.equal(proxy, proxy2);
    });

    it('does not try to proxy a proxy object when setting', () => {
      const obj = {
        foo: 'bar'
      };
      const obj2 = {
        hello: 'world'
      };
      const proxy = watch(obj);
      const proxy2 = watch(obj2);
      assert.doesNotThrow(() => {
        proxy.thing = obj2;
      });
    });
  });

  describe('startWatchingPaths', () => {
    afterEach(() => {
      stopWatchingPaths();
    });

    it('adds accessed property', () => {
      const obj = {
        foo: 'bar'
      };
      const proxy = watch(obj);
      proxy.foo;
      assert.lengthOf(accessedPaths, 0);
      startWatchingPaths();
      proxy.foo;
      stopWatchingPaths();

      assert.lengthOf(accessedPaths, 1);
      assert.deepEqual(accessedPaths, [{ obj, key: 'foo' }]);
    });

    it('adds multiple accessed properties', () => {
      const obj = {
        foo: 'bar',
        hello: 'world'
      };
      const proxy = watch(obj);
      startWatchingPaths();
      proxy.foo;
      proxy.hello;
      stopWatchingPaths();

      assert.deepEqual(accessedPaths, [
        { obj, key: 'foo' },
        { obj, key: 'hello' }
      ]);
    });

    it('adds nested accessed properties', () => {
      const obj = {
        thing: 1,
        foo: {
          bar: {
            baz: 'hello'
          }
        }
      };
      const proxy = watch(obj);
      startWatchingPaths();
      proxy.thing;
      proxy.foo;
      proxy.foo.bar;
      proxy.foo.bar.baz;
      stopWatchingPaths();

      assert.deepEqual(accessedPaths, [
        { obj, key: 'thing' },
        { obj, key: 'foo' },
        { obj: obj.foo, key: 'bar' },
        { obj: obj.foo.bar, key: 'baz' }
      ]);
    });

    it('clears out previous watched state', () => {
      const obj = {
        foo: 'bar'
      };
      const proxy = watch(obj);
      startWatchingPaths();
      proxy.foo;
      stopWatchingPaths();

      assert.lengthOf(accessedPaths, 1);
      assert.deepEqual(accessedPaths, [{ obj, key: 'foo' }]);

      startWatchingPaths();
      assert.lengthOf(accessedPaths, 0);
    });
  });

  describe('stopWatchingPaths', () => {
    it("doesn't add accessed paths", () => {
      const obj = {
        foo: 'bar'
      };
      const proxy = watch(obj);
      proxy.foo;
      assert.lengthOf(accessedPaths, 0);
      startWatchingPaths();
      stopWatchingPaths();
      proxy.foo;

      assert.lengthOf(accessedPaths, 0);
    });
  });
});
