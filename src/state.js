const handler = {
  get(target, key, receiver) {
    if (target === _state) {
      watchedExpressions.push(`state.${key}`);
    }
    else {
      watchedExpressions[watchedExpressions.length - 1] = watchedExpressions[watchedExpressions.length - 1] + '.' + key;
    }

    return Reflect.get(...arguments);
  },

  set(obj, prop, value) {
    if (isObject(value)) {
      return Reflect.set(obj, prop, proxyObject(value));
    }

    return Reflect.set(...arguments)
  }
}

const _state = {};
const state = new Proxy(_state, handler);
export default state;

export const watchedExpressions = [];

function proxyObject(obj) {
  const proxy = new Proxy(obj, handler);
  Object.entries(obj).forEach(([key, value]) => {
    if (isObject(value)) {
      // call set with object to turn into proxy
      proxy[key] = value;
    }
  });
  return proxy;
}

function isObject(value) {
  return typeof value === 'object' && value !== null;
}

export function clearWatchedExpressions() {
  watchedExpressions.length = 0;
}

window.state = state;
window._state = _state;
window.clearWatchedExpressions = clearWatchedExpressions;
window.watchedExpressions = watchedExpressions;

state.foo = {
  bar: 1,
  baz: 'thing',
  fizz: {
    hello: {
      world: 'world'
    },
    hi: 1
  }
}