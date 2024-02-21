import queue from './queue.js';

let rAF = requestAnimationFrame(tick);
let lastUpdate;

function tick() {
  rAF = requestAnimationFrame(tick);

  const now = performance.now();
  const dt = now - lastUpdate;

  // only update once every 100ms (no need to update every frame)
  if (dt < 100) {
    return;
  }

  lastUpdate = now;
  queue.forEach(item => {
    item.update();
  });
  queue.clear();
}