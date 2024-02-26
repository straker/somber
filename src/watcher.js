// allow proxy object to output to string rather than error
Proxy.constructor.toString = () => { return '[object Object]' };

let watching = false;
let lastAccessedPath = '';
export const accessedPaths = [];

const handler = {
  get(obj, key) {
    if (typeof key !== 'string') {
      return Reflect.get(...arguments);
    }

    if (watching) {
      const path = obj.__p + '.' + key
      if (lastAccessedPath !== obj.__p) {
        lastAccessedPath = path;
        accessedPaths.push(path);
      }
      else {
        lastAccessedPath = path;
        accessedPaths[accessedPaths.length - 1] = path;
      }
    }

    return Reflect.get(...arguments);
  },

  set(obj, key, value) {
    let newValue;
    if (isObject(value)) {
      newValue = Reflect.set(obj, key, proxyObject(obj.__p + '.' + key, value, obj.__r));
    }
    else {
      newValue = Reflect.set(...arguments)
    }

    // fire event for the current object and all parent objects
    let path = obj.__p + '.' + key;;
    while (path) {
      obj.__r.dispatchEvent(new CustomEvent(path, {
        detail: {
          value,
          oldValue: obj[key]
        }
      }));
      const lastIndex = path.lastIndexOf('.');
      path = path.slice(0, lastIndex !== -1 ? lastIndex : 0);
    }

    return newValue;
  }
}

export function watchObject(name, obj, node) {
  // object has already been watched
  if (obj.__r) {
    return obj;
  }

  const proxy = proxyObject(name, obj, node);
  return proxy;
}

function proxyObject(name, obj, node) {
  const proxy = new Proxy(obj, handler);
  Object.defineProperties(obj, {
    // __r = reactive node
    __r: {
      value: node,
      enumerable: false
    },
    // __p = object path
    __p: {
      value: name,
      enumerable: false
    }
  });

  Object.entries(obj).forEach(([key, value]) => {
    if (isObject(value) && !value.__r) {
      // call set with object to turn into proxy
      proxy[key] = value;
    }
  });

  return proxy;
}

function isObject(value) {
  return value && typeof value === 'object';
}

export function startWatchingPaths() {
  watching = true;
  accessedPaths.length = 0;
  lastAccessedPath = '';
}

export function stopWatchingPaths() {
  watching = false;
}

window.accessedPaths = accessedPaths;
window.startWatchingPaths = startWatchingPaths;
window.stopWatchingPaths = stopWatchingPaths;