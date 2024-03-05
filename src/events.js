const callbacks = new WeakMap();
window.callbacks = callbacks

export function on(obj, key, callback) {
  let cbs = callbacks.get(obj);
  if (!cbs) {
    cbs = {};
    callbacks.set(obj, cbs);
  }

  cbs[key] = cbs[key] ?? [];
  cbs[key].push(callback);
}

export function off(obj, key, callback) {
  const cbs = callbacks.get(obj);
  if (!cbs?.[key]) {
    return;
  }

  cbs[key] = cbs[key].filter(cb => cb != callback);

  // cleanup memory pointers to objects
  if (!cbs[key].length) {
    delete cbs[key];
  }
  if (!Object.keys(cbs).length) {
    callbacks.delete(obj);
  }
}

export function emit(obj, key, ...args) {
  const cbs = callbacks.get(obj);
  if (cbs?.[key]) {
    cbs[key].map(callback => callback(...args));
  }

  if (obj.__p) {
    emit(obj.__p.obj, obj.__p.key, ...args);
  }
}