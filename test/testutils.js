import SomberElement from '../src/somber-element.js';

let fixture, html;

before(() => {
  fixture = document.createElement('div');
  fixture.setAttribute('id', 'fixture');
  document.body.appendChild(fixture);

  class TestComponent extends SomberElement {
    render() {
      return this.html(html);
    }
  }

  customElements.define('test-component', TestComponent);
});

afterEach(() => {
  fixture.innerHTML = '';
  html = '';
});

export function setupFixture(str, props = {}) {
  html = str;
  const host = document.createElement('test-component');
  Object.entries(props).forEach(([name, value]) => {
    host[name] = value;
  });
  fixture.appendChild(host);
  const target = document.querySelector('#target');
  assert(target, 'target not found');
  return { host, target };
}

export function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export function getFixture() {
  return fixture;
}
