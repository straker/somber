import { emit } from './events.js';

const handler = {
  get(obj, key) {
    return Reflect.get(...arguments);
  },

  set(obj, key, value) {
    let newValue;
    if (isObject(value) && !isProxied(value)) {
      newValue = Reflect.set(obj, key, proxyObject(value));

      // keep track of the parent object so we can emit up the
      // entire object ancestry
      Object.defineProperty(value, '__p', {
        value: { obj, key },
        enumberable: false
      });
    } else {
      newValue = Reflect.set(...arguments);
    }

    // fire event for the current object and all parent objects
    emit(obj, key);

    return newValue;
  }
};

export default function watch(obj) {
  if (isProxied(obj)) {
    return obj;
  }

  // root proxy object
  Object.defineProperty(obj, '__p', {
    value: null,
    enumberable: false
  });

  return proxyObject(obj);
}

function isProxied(obj) {
  return '__p' in obj;
}

function proxyObject(obj) {
  const proxy = new Proxy(obj, handler);

  // keep track of the original object so we can track
  // the object that will be accessed next in a chain
  Object.defineProperty(proxy, '__s', {
    value: obj,
    enumberable: false
  });

  Object.entries(obj).map(([key, value]) => {
    if (isObject(value) && !isProxied(value)) {
      proxy[key] = value;
    }
  });

  return proxy;
}

function isObject(value) {
  return value && typeof value == 'object';
}
