import { setupFixture } from '../testutils.js';
import walk from '../../src/walk.js';

describe('for directive', () => {
  it('removes the binding attribute', () => {
    const { target } = setupFixture(
      `<div id="target" :for="item in state.array">hello</div>`,
      {
        state: {
          array: [1]
        }
      }
    );
    assert.isFalse(target.hasAttribute(':for'));
  });

  it('throws error if binding is invalid', () => {
    // can't use setupFixture since handling errors in the
    // connectedCallback of a custom element isn't catchable
    // before the test fails (can't use assert.throw or
    // try / catch)
    const div = document.createElement('div');
    div.innerHTML = '<div id="target" :for="state.array">hello</div>';
    assert.throws(() => {
      walk(
        div,
        {
          state: {
            array: []
          }
        },
        div
      );
    });
  });

  describe('array', () => {
    it('adds a child for each item of the array', () => {
      const { host } = setupFixture(
        `<div id="target" :for="item in state.array">
        </div>`,
        {
          state: {
            array: [1, 2, 3, 4]
          }
        }
      );
      assert.equal(host.children.length, 4);
      assert.isTrue(
        Array.from(host.children).every(
          node => node.nodeName.toLowerCase() === 'div'
        )
      );
    });

    it('processes the value', () => {
      const { host } = setupFixture(
        `<div id="target" :for="item in state.array">
          {{ item }}
        </div>`,
        {
          state: {
            array: [1, 2, 3, 4]
          }
        }
      );
      for (let i = 0; i < 4; i++) {
        assert.equal(host.children[i].textContent, i + 1);
      }
    });

    it('processes the value when object', () => {
      const { host } = setupFixture(
        `<div id="target" :for="item in state.array">
          {{ item.text }}
        </div>`,
        {
          state: {
            array: [{ text: 1 }, { text: 2 }, { text: 3 }]
          }
        }
      );
      for (let i = 0; i < 3; i++) {
        assert.equal(host.children[i].textContent, i + 1);
      }
    });

    it('processes the value and index', () => {
      const { host } = setupFixture(
        `<div id="target" :for="(item, index) in state.array">
          {{ index }}.{{ item }}
        </div>`,
        {
          state: {
            array: [1, 2, 3, 4]
          }
        }
      );
      for (let i = 0; i < 4; i++) {
        assert.equal(host.children[i].textContent, `${i}.${i + 1}`);
      }
    });

    it('defaults index to $index', () => {
      const { host } = setupFixture(
        `<div id="target" :for="item in state.array">
          {{ $index }}.{{ item }}
        </div>`,
        {
          state: {
            array: [1, 2, 3, 4]
          }
        }
      );
      for (let i = 0; i < 4; i++) {
        assert.equal(host.children[i].textContent, `${i}.${i + 1}`);
      }
    });

    it('processes the value and index as any name', () => {
      const { host } = setupFixture(
        `<div id="target" :for="(foobar, baz) in state.array">
          {{ baz }}.{{ foobar }}
        </div>`,
        {
          state: {
            array: [1, 2, 3, 4]
          }
        }
      );
      for (let i = 0; i < 4; i++) {
        assert.equal(host.children[i].textContent, `${i}.${i + 1}`);
      }
    });

    it('processes bindings on the nodes', () => {
      const { host } = setupFixture(
        `<div id="target" :for="(value, index) in state.array">
          <span :foo="state.count">{{ index }}.{{ value }}</span>
        </div>`,
        {
          state: {
            count: 10,
            array: [1, 2, 3, 4]
          }
        }
      );
      assert.isTrue(
        Array.from(host.children).every(node =>
          node.firstElementChild.getAttribute('foo', '10')
        )
      );
    });

    it('handles bindings changing on the nodes', () => {
      const { host } = setupFixture(
        `<div id="target" :for="(value, index) in state.array">
          <span :foo="state.count">{{ index }}.{{ value }}</span>
        </div>`,
        {
          state: {
            count: 10,
            array: [1, 2, 3, 4]
          }
        }
      );
      host.state.count = 20;
      assert.isTrue(
        Array.from(host.children).every(node =>
          node.firstElementChild.getAttribute('foo', '20')
        )
      );
    });

    it('does not re-render the nodes when bindings change', () => {
      const { host } = setupFixture(
        `<div id="target" :for="item in state.array">hello</div>`,
        {
          state: {
            count: 10,
            array: [1, 2, 3, 4]
          }
        }
      );
      const nodes = Array.from(host.children);
      host.state.count = 20;
      assert.isTrue(
        Array.from(host.children).every(
          (node, index) => node === nodes[index]
        )
      );
    });
  });

  describe('object', () => {
    it('adds a child for each key of the object', () => {
      const { host } = setupFixture(
        `<div id="target" :for="item in state.obj">
        </div>`,
        {
          state: {
            obj: {
              first_name: 'John',
              last_name: 'Doe',
              age: 'unknown',
              height: '5.9'
            }
          }
        }
      );

      assert.equal(host.children.length, 4);
      assert.isTrue(
        Array.from(host.children).every(
          node => node.nodeName.toLowerCase() === 'div'
        )
      );
    });

    it('processes the value', () => {
      const { host } = setupFixture(
        `<div id="target" :for="value in state.obj">
          {{ value }}
        </div>`,
        {
          state: {
            obj: {
              first_name: 'John',
              last_name: 'Doe',
              age: 'unknown',
              height: '5.9'
            }
          }
        }
      );

      const values = Object.values(host.state.obj);
      for (let i = 0; i < 4; i++) {
        assert.equal(host.children[i].textContent, values[i]);
      }
    });

    it('processes the value and key', () => {
      const { host } = setupFixture(
        `<div id="target" :for="(value, key) in state.obj">
          {{ key }}: {{ value }}
        </div>`,
        {
          state: {
            obj: {
              first_name: 'John',
              last_name: 'Doe',
              age: 'unknown',
              height: '5.9'
            }
          }
        }
      );
      const entries = Object.entries(host.state.obj);
      for (let i = 0; i < 4; i++) {
        assert.equal(
          host.children[i].textContent,
          `${entries[i][0]}: ${entries[i][1]}`
        );
      }
    });

    it('processes the value, key, and index', () => {
      const { host } = setupFixture(
        `<div id="target" :for="(value, key, index) in state.obj">
          {{index}}. {{ key }}: {{ value }}
        </div>`,
        {
          state: {
            obj: {
              first_name: 'John',
              last_name: 'Doe',
              age: 'unknown',
              height: '5.9'
            }
          }
        }
      );
      const entries = Object.entries(host.state.obj);
      for (let i = 0; i < 4; i++) {
        assert.equal(
          host.children[i].textContent,
          `${i}. ${entries[i][0]}: ${entries[i][1]}`
        );
      }
    });

    it('processes the value, key, and index as any name', () => {
      const { host } = setupFixture(
        `<div id="target" :for="(foo, bar, baz) in state.obj">
          {{baz}}. {{ bar }}: {{ foo }}
        </div>`,
        {
          state: {
            obj: {
              first_name: 'John',
              last_name: 'Doe',
              age: 'unknown',
              height: '5.9'
            }
          }
        }
      );
      const entries = Object.entries(host.state.obj);
      for (let i = 0; i < 4; i++) {
        assert.equal(
          host.children[i].textContent,
          `${i}. ${entries[i][0]}: ${entries[i][1]}`
        );
      }
    });

    it('processes bindings on the nodes', () => {
      const { host } = setupFixture(
        `<div id="target" :for="(value, key, index) in state.obj">
          <span :foo="state.count">{{index}}. {{ key }}: {{ value }}</span>
        </div>`,
        {
          state: {
            count: 10,
            obj: {
              first_name: 'John',
              last_name: 'Doe',
              age: 'unknown',
              height: '5.9'
            }
          }
        }
      );
      assert.isTrue(
        Array.from(host.children).every(node =>
          node.firstElementChild.getAttribute('foo', '10')
        )
      );
    });

    it('handles bindings changing on the nodes', () => {
      const { host } = setupFixture(
        `<div id="target" :for="(value, key, index) in state.obj">
          <span :foo="state.count">{{index}}. {{ key }}: {{ value }}</span>
        </div>`,
        {
          state: {
            count: 10,
            obj: {
              first_name: 'John',
              last_name: 'Doe',
              age: 'unknown',
              height: '5.9'
            }
          }
        }
      );
      host.state.count = 20;
      assert.isTrue(
        Array.from(host.children).every(node =>
          node.firstElementChild.getAttribute('foo', '20')
        )
      );
    });

    it('does not re-render the nodes when bindings change', () => {
      const { host } = setupFixture(
        `<div id="target" :for="(value, key, index) in state.obj">
          <span :foo="state.count">{{index}}. {{ key }}: {{ value }}</span>
        </div>`,
        {
          state: {
            count: 10,
            obj: {
              first_name: 'John',
              last_name: 'Doe',
              age: 'unknown',
              height: '5.9'
            }
          }
        }
      );
      const nodes = Array.from(host.children);
      host.state.count = 20;
      assert.isTrue(
        Array.from(host.children).every(
          (node, index) => node === nodes[index]
        )
      );
    });
  });

  describe('when the binding changes', () => {
    it('updates child nodes', () => {
      const { host } = setupFixture(
        `<div id="target" :for="item in state.array">
        </div>`,
        {
          state: {
            array: [1, 2, 3, 4]
          }
        }
      );
      host.state.array.push(5);
      assert.equal(host.children.length, 5);
      assert.isTrue(
        Array.from(host.children).every(
          node => node.nodeName.toLowerCase() === 'div'
        )
      );
    });

    it('removes child nodes', () => {
      const { host } = setupFixture(
        `<div id="target" :for="item in state.array">
        </div>`,
        {
          state: {
            array: [1, 2, 3, 4]
          }
        }
      );
      host.state.array.length = 2;
      assert.equal(host.children.length, 2);
    });

    it('removes child nodes with :key', () => {
      const { host } = setupFixture(
        `<div id="target" :for="item in state.array" :key="item">
        </div>`,
        {
          state: {
            array: [1, 2, 3, 4]
          }
        }
      );
      host.state.array.length = 2;
      assert.equal(host.children.length, 2);
    });

    it('handles sparse arrays', () => {
      const { host } = setupFixture(
        `<div id="target" :for="item in state.array" :key="item">
        </div>`,
        {
          state: {
            array: [1, 2, 3, 4]
          }
        }
      );
      host.state.array[6] = 7;
      assert.equal(host.children.length, 5);
    });

    it('updates all children without :key', () => {
      const { host } = setupFixture(
        `<div id="target" :for="item in state.array">
        </div>`,
        {
          state: {
            array: [1, 2, 3, 4]
          }
        }
      );
      const children = [...host.children];
      host.state.array.push(5);
      assert.isFalse(
        Array.from(host.children).some(
          (child, index) => child === children[index]
        )
      );
    });

    it('only updates the changed child with :key (modification)', () => {
      const { host } = setupFixture(
        `<div id="target" :for="item in state.array" :key="item">
        </div>`,
        {
          state: {
            array: [1, 2, 3, 4]
          }
        }
      );
      const children = [...host.children];
      host.state.array[2] = 6;
      assert.isTrue(
        Array.from(host.children).every((child, index) => {
          if (index === 2) {
            return true;
          }

          return child === children[index];
        })
      );
      assert.isFalse(host.children[2] === children[2]);
    });

    it('only updates the changed child with :key (addition)', () => {
      const { host } = setupFixture(
        `<div id="target" :for="item in state.array" :key="item">
        </div>`,
        {
          state: {
            array: [1, 2, 3, 4]
          }
        }
      );
      const children = [...host.children];
      host.state.array.push(5);
      assert.isTrue(
        Array.from(host.children).every((child, index) => {
          if (index >= 4) {
            return true;
          }

          return child === children[index];
        })
      );
    });

    it(':key works with object iterator', () => {
      const { host } = setupFixture(
        `<div id="target" :for="(value, key, index) in state.obj" :key="value">
        </div>`,
        {
          state: {
            obj: {
              first_name: 'John',
              last_name: 'Doe',
              age: 'unknown',
              height: '5.9'
            }
          }
        }
      );
      const children = [...host.children];
      host.state.obj.weight = 150;
      assert.isTrue(
        Array.from(host.children).every((child, index) => {
          if (index >= 4) {
            return true;
          }

          return child === children[index];
        })
      );
    });

    it(':key works with object as :key', () => {
      const { host } = setupFixture(
        `<div id="target" :for="item in state.array" :key="item.id">
        </div>`,
        {
          state: {
            array: [
              {
                id: 0
              },
              {
                id: 1
              },
              {
                id: 2
              },
              {
                id: 3
              }
            ]
          }
        }
      );
      const children = [...host.children];
      host.state.array.push(5);
      assert.isTrue(
        Array.from(host.children).every((child, index) => {
          if (index >= 4) {
            return true;
          }

          return child === children[index];
        })
      );
    });

    it('does not replace node when sub-binding updates', () => {
      const { host } = setupFixture(
        `<div id="target" :for="item in state.array" :key="item.id">
          <span>{{ item.first_name }}</span>
        </div>`,
        {
          state: {
            array: [
              {
                id: 0,
                first_name: 'John'
              },
              {
                id: 1,
                first_name: 'Jane'
              },
              {
                id: 2,
                first_name: 'Jessie'
              },
              {
                id: 3,
                first_name: 'Joseph'
              }
            ]
          }
        }
      );
      const children = [...host.children];
      host.state.array[2].first_name = 'Bob';
      assert.isTrue(host.children[2] === children[2]);
      assert.equal(host.children[2].textContent.trim(), 'Bob');
    });
  });
});
