import { emit } from './events.js';

// allow proxy object to output to string rather than error
Proxy.constructor.toString = () => { return '[object Object]' };
const defineProps = Object.defineProperties;

let watching = false;
let lastAccessed = {};
export const accessedPaths = [];

const handler = {
  get(obj, key, count) {
    if (!watching || typeof key !== 'string') {
      return Reflect.get(...arguments);
    }

    const value = obj[key];

    if (!isObject(value) || !lastAccessed.obj) {
      lastAccessed = {};
      accessedPaths.push({ obj, key, value });
    }
    else {
      accessedPaths[accessedPaths.length - 1] = { obj, key, value };
    }

    return Reflect.get(...arguments);
  },

  set(obj, key, value) {
    let newValue;
    if (isObject(value)) {
      newValue = Reflect.set(obj, key, proxyObject(value));
    }
    else {
      newValue = Reflect.set(...arguments)
    }

    // fire event for the current object and all parent objects
    emit(obj, key);

    return newValue;
  }
}

export function watchObject(obj) {
  if (alreadyProxied(obj)) {
    return obj;
  }

  // root proxy object
  Object.defineProperty(obj, '__p', {
    value: null,
    enumberable: false
  });

  return proxyObject(obj);
}

function proxyObject(obj) {
  const proxy = new Proxy(obj, handler);

  Object.entries(obj).map(([key, value]) => {
    if (isObject(value) && !alreadyProxied(value)) {
      // keep track of the parent object so we can emit up the
      // entire object ancestry
      Object.defineProperty(value, '__p', {
        value: { obj, key },
        enumberable: false
      });
      // call set with object to turn into proxy
      proxy[key] = value;
    }
  });

  return proxy;
}

function isObject(value) {
  return value && typeof value === 'object';
}

function alreadyProxied(obj) {
  return '__p' in obj;
}

export function startWatchingPaths() {
  watching = true;
  accessedPaths.length = 0;
  lastAccessed = {};
}

export function stopWatchingPaths() {
  watching = false;
}