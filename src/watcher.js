import { emit } from './events.js';

// allow proxy object to output to string rather than error
Proxy.constructor.toString = () => {
  return '[object Object]';
};

let watching = false;
let next;
export const accessedPaths = [];

const handler = {
  get(obj, key) {
    if (!watching || typeof key != 'string' || key.startsWith('__')) {
      return Reflect.get(...arguments);
    }

    if (next != obj) {
      accessedPaths.push({ obj, key });
    } else {
      accessedPaths[accessedPaths.length - 1] = { obj, key };
    }

    const value = obj[key];
    if (!isObject(value)) {
      next = null;
    } else {
      next = value.__s;
    }

    return Reflect.get(...arguments);
  },

  set(obj, key, value) {
    let newValue;
    if (isObject(value)) {
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

export function watchObject(obj) {
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

export function startWatchingPaths() {
  watching = true;
  accessedPaths.length = 0;
  next = null;
}

export function stopWatchingPaths() {
  watching = false;
}

function isProxied(obj) {
  return '__p' in obj;
}

function proxyObject(obj) {
  const proxy = new Proxy(obj, handler);

  // root proxy object
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
