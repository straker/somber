const handler = {
  get(obj, key) {
    if (watchedObjects.has(obj)) {
      const { name } = watchedObjects.get(obj);
      accessedVars.push(`${name}.${key}`);
    }
    else {
      accessedVars[accessedVars.length - 1] = accessedVars[accessedVars.length - 1] + '.' + key;
    }

    return Reflect.get(...arguments);
  },

  set(obj, key, value) {
    let variable;
    if (watchedObjects.has(obj)) {
      const { name } = watchedObjects.get(obj);
      variable = `${name}.${key}`
    }
    else {
      variable = accessedVars[accessedVars.length - 1] + '.' + key;
    }

    let newValue;
    if (isObject(value)) {
      newValue = Reflect.set(obj, key, proxyObject(value, obj._n));
    }
    else {
      newValue = Reflect.set(...arguments)
    }

    obj._n.dispatchEvent(new CustomEvent(variable, {
      detail: {
        value,
        oldValue: obj[key]
      }
    }));

    return newValue;
  }
}

const watchedObjects = new Map();
export const accessedVars = [];

export function watchObject(name, obj, node) {
  if (watchedObjects.has(obj)) {
    return watchedObjects.get(obj).proxy;
  }

  const proxy = proxyObject(obj, node);
  watchedObjects.set(obj, { name, proxy });
  return proxy;
}

function proxyObject(obj, node) {
  const proxy = new Proxy(obj, handler);
  obj._n = node;

  Object.entries(obj).forEach(([key, value]) => {
    if (isObject(value) && key !== '_n') {
      // call set with object to turn into proxy
      proxy[key] = value;
    }
  });

  return proxy;
}

function isObject(value) {
  return typeof value === 'object' && value !== null;
}

export function clearAccessedVars() {
  accessedVars.length = 0;
}