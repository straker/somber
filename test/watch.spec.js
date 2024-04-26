import watch from '../src/watch.js';
import { on } from '../src/events.js';

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
