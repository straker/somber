import CustomElement from '../../src/custom-element.js';
import { setupFixture, wait } from '../utils.js';

describe('for directive', () => {
  it('removes the binding attribute', () => {
    const { target } = setupFixture(`<div id="target" :for="item in state.array">hello</div>`, {
      state: {
        array: []
      }
    });
    assert.isFalse(target.hasAttribute(':for'));
  });

  describe('array', () => {
    it('adds a child for each item of the array', () => {
      const { target } = setupFixture(`<div id="target" :for="item in state.array"><span></span></div>`, {
        state: {
          array: [1,2,3,4]
        }
      });
      assert.equal(target.children.length, 4);
      assert.isTrue(Array.from(target.children).every(node => node.nodeName.toLowerCase() === 'span'));
    });

    it('processes the value', () => {
      const { target } = setupFixture(`<div id="target" :for="item in state.array"><span>{{ item }}</span></div>`, {
        state: {
          array: [1,2,3,4]
        }
      });
      for (let i = 0; i < 4; i++) {
        assert.equal(target.children[i].textContent, i+1);
      }
    });

    it('processes the value when object', () => {
      const { target } = setupFixture(`<div id="target" :for="item in state.array"><span>{{ item.text }}</span></div>`, {
        state: {
          array: [{ text: 1 }, { text: 2 }, { text: 3 }]
        }
      });
      for (let i = 0; i < 3; i++) {
        assert.equal(target.children[i].textContent, i+1);
      }
    });

    it('processes the value and index', () => {
      const { target } = setupFixture(`<div id="target" :for="(item, index) in state.array"><span>{{ index }}.{{ item }}</span></div>`, {
        state: {
          array: [1,2,3,4]
        }
      });
      for (let i = 0; i < 4; i++) {
        assert.equal(target.children[i].textContent, `${i}.${i+1}`);
      }
    });

    it('processes the value and index as any name', () => {
      const { target } = setupFixture(`<div id="target" :for="(foobar, baz) in state.array"><span>{{ baz }}.{{ foobar }}</span></div>`, {
        state: {
          array: [1,2,3,4]
        }
      });
      for (let i = 0; i < 4; i++) {
        assert.equal(target.children[i].textContent, `${i}.${i+1}`);
      }
    });

    it('processes bindings on the nodes', () => {
      const { target } = setupFixture(`<div id="target" :for="(value, index) in state.array"><span :foo="state.count">{{ index }}.{{ value }}</span></div>`, {
        state: {
          count: 10,
          array: [1,2,3,4]
        }
      });
      assert.isTrue(Array.from(target.children).every(node => node.getAttribute('foo', '10')));
    });

    it('handles bindings changing on the nodes', () => {
      const { target, host } = setupFixture(`<div id="target" :for="(value, index) in state.array"><span :foo="state.count">{{ index }}.{{ value }}</span></div>`, {
        state: {
          count: 10,
          array: [1,2,3,4]
        }
      });
      host.state.count = 20;
      assert.isTrue(Array.from(target.children).every(node => node.getAttribute('foo', '20')));
    });

    it('does not re-render the nodes when bindings change', () => {
      const { target, host } = setupFixture(`<div id="target" :foo="state.value">hello</div>`, {
        state: {
          count: 10,
          array: [1,2,3,4]
        }
      });
      const nodes = Array.from(target.children);
      host.state.count = 20;
      assert.isTrue(Array.from(target.children).every((node, index) => node === nodes[index]));
    });
  });

  describe('object', () => {
    it('adds a child for each key of the object', () => {
      const { target, host } = setupFixture(`<div id="target" :for="item in state.obj"><span></span></div>`, {
        state: {
          obj: {
            first_name: 'John',
            last_name: 'Doe',
            age: 'unknown',
            height: '5.9'
          }
        }
      });

      assert.equal(target.children.length, 4);
      assert.isTrue(Array.from(target.children).every(node => node.nodeName.toLowerCase() === 'span'));
    });

    it('processes the value', () => {
      const { target, host } = setupFixture(`<div id="target" :for="value in state.obj"><span>{{ value }}</span></div>`, {
        state: {
          obj: {
            first_name: 'John',
            last_name: 'Doe',
            age: 'unknown',
            height: '5.9'
          }
        }
      });

      const values = Object.values(host.state.obj);
      for (let i = 0; i < 4; i++) {
        assert.equal(target.children[i].textContent, values[i]);
      }
    });

    it('processes the value and key', () => {
      const { target, host } = setupFixture(`<div id="target" :for="(value, key) in state.obj"><span>{{ key }}: {{ value }}</span></div>`, {
        state: {
          obj: {
            first_name: 'John',
            last_name: 'Doe',
            age: 'unknown',
            height: '5.9'
          }
        }
      });
      const entries = Object.entries(host.state.obj);
      for (let i = 0; i < 4; i++) {
        assert.equal(target.children[i].textContent, `${entries[i][0]}: ${entries[i][1]}`);
      }
    });

    it('processes the value, key, and index', () => {
      const { target, host } = setupFixture(`<div id="target" :for="(value, key, index) in state.obj"><span>{{index}}. {{ key }}: {{ value }}</span></div>`, {
        state: {
          obj: {
            first_name: 'John',
            last_name: 'Doe',
            age: 'unknown',
            height: '5.9'
          }
        }
      });
      const entries = Object.entries(host.state.obj);
      for (let i = 0; i < 4; i++) {
        assert.equal(target.children[i].textContent, `${i}. ${entries[i][0]}: ${entries[i][1]}`);
      }
    });

    it('processes the value, key, and index as any name', () => {
      const { target, host } = setupFixture(`<div id="target" :for="(foo, bar, baz) in state.obj"><span>{{baz}}. {{ bar }}: {{ foo }}</span></div>`, {
        state: {
          obj: {
            first_name: 'John',
            last_name: 'Doe',
            age: 'unknown',
            height: '5.9'
          }
        }
      });
      const entries = Object.entries(host.state.obj);
      for (let i = 0; i < 4; i++) {
        assert.equal(target.children[i].textContent, `${i}. ${entries[i][0]}: ${entries[i][1]}`);
      }
    });

    it('processes bindings on the nodes', () => {
      const { target, host } = setupFixture(`<div id="target" :for="(value, key, index) in state.obj"><span :foo="state.count">{{index}}. {{ key }}: {{ value }}</span></div>`, {
        state: {
          count: 10,
          obj: {
            first_name: 'John',
            last_name: 'Doe',
            age: 'unknown',
            height: '5.9'
          }
        }
      });
      assert.isTrue(Array.from(target.children).every(node => node.getAttribute('foo', '10')));
    });

    it('handles bindings changing on the nodes', () => {
      const { target, host } = setupFixture(`<div id="target" :for="(value, key, index) in state.obj"><span :foo="state.count">{{index}}. {{ key }}: {{ value }}</span></div>`, {
        state: {
          count: 10,
          obj: {
            first_name: 'John',
            last_name: 'Doe',
            age: 'unknown',
            height: '5.9'
          }
        }
      });
      host.state.count = 20;
      assert.isTrue(Array.from(target.children).every(node => node.getAttribute('foo', '20')));
    });

    it('does not re-render the nodes when bindings change', () => {
      const { target, host } = setupFixture(`<div id="target" :for="(value, key, index) in state.obj"><span :foo="state.count">{{index}}. {{ key }}: {{ value }}</span></div>`, {
        state: {
          count: 10,
          obj: {
            first_name: 'John',
            last_name: 'Doe',
            age: 'unknown',
            height: '5.9'
          }
        }
      });
      const nodes = Array.from(target.children);
      host.state.count = 20;
      assert.isTrue(Array.from(target.children).every((node, index) => node === nodes[index]));
    });
  });

  describe('when the binding changes', () => {
    it('does not re-render the element', () => {
      const { target, host } = setupFixture(`<div id="target" :for="item in state.array"><span></span></div>`, {
        state: {
          array: [1,2,3,4]
        }
      });
      host.state.array.push(5);
      assert.equal(target, host.querySelector('#target'));
    });

    it('updates child nodes', () => {
      const { target, host } = setupFixture(`<div id="target" :for="item in state.array"><span></span></div>`, {
        state: {
          array: [1,2,3,4]
        }
      });
      host.state.array.push(5);
      assert.equal(target.children.length, 5);
      assert.isTrue(Array.from(target.children).every(node => node.nodeName.toLowerCase() === 'span'));
    });

    it('updates all children without :key', () => {
      const { target, host } = setupFixture(`<div id="target" :for="item in state.array"><span></span></div>`, {
        state: {
          array: [1,2,3,4]
        }
      });
      const children = [...target.children];
      host.state.array.push(5);
      assert.isFalse(Array.from(target.children).some((child, index) => child === children[index]));
    });

    it('only updates the changed child with :key (modification)', () => {
      const { target, host } = setupFixture(`<div id="target" :for="item in state.array" :key="item"><span></span></div>`, {
        state: {
          array: [1,2,3,4]
        }
      });
      const children = [...target.children];
      host.state.array[2] = 6;
      assert.isTrue(Array.from(target.children).every((child, index) => {
        if (index === 2) {
          return true;
        }

        return child === children[index]
      }));
      assert.isFalse(target.children[2] === children[2]);
    });

    it('only updates the changed child with :key (addition)', () => {
      const { target, host } = setupFixture(`<div id="target" :for="item in state.array" :key="item"><span></span></div>`, {
        state: {
          array: [1,2,3,4]
        }
      });
      const children = [...target.children];
      host.state.array.push(5);
      assert.isTrue(Array.from(target.children).every((child, index) => {
        if (index >= 4) {
          return true;
        }

        return child === children[index]
      }));
    });

    it(':key works with object iterator', () => {
      const { target, host } = setupFixture(`<div id="target" :for="(value, key, index) in state.obj" :key="value"><span></span></div>`, {
        state: {
          obj: {
            first_name: 'John',
            last_name: 'Doe',
            age: 'unknown',
            height: '5.9'
          }
        }
      });
      const children = [...target.children];
      host.state.obj.weight = 150;
      assert.isTrue(Array.from(target.children).every((child, index) => {
        if (index >= 4) {
          return true;
        }

        return child === children[index]
      }));
    });

    it(':key works with object as :key', () => {
      const { target, host } = setupFixture(`<div id="target" :for="item in state.array" :key="item.id"><span></span></div>`, {
        state: {
          array: [{
            id: 0,
          },
          {
            id: 1,
          },
          {
            id: 2,
          },
          {
            id: 3
          }]
        }
      });
      const children = [...target.children];
      host.state.array.push(5);
      assert.isTrue(Array.from(target.children).every((child, index) => {
        if (index >= 4) {
          return true;
        }

        return child === children[index]
      }));
    });

    it('does not replace node when sub-binding updates', () => {
      const { target, host } = setupFixture(`<div id="target" :for="item in state.array" :key="item.id"><span>{{ item.first_name }}</span></div>`, {
        state: {
          array: [{
            id: 0,
            first_name: 'John',
          },
          {
            id: 1,
            first_name: 'Jane',
          },
          {
            id: 2,
            first_name: 'Jessie',
          },
          {
            id: 3,
            first_name: 'Joseph',
          }]
        }
      });
      const children = [...target.children];
      host.state.array[2].first_name = 'Bob';
      assert.isTrue(target.children[2] === children[2]);
      assert.equal(target.children[2].textContent, 'Bob');
    });
  });
});