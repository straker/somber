import { setupFixture } from '../testutils.js';
import walk from '../../src/walk.js';

describe('for directive', () => {
  it('removes the binding attribute', () => {
    const { target } = setupFixture(
      `<div id="target" :for="item in array">hello</div>`,
      {
        array: []
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
    div.innerHTML = '<div id="target" :for="array">hello</div>';
    assert.throws(() => {
      walk(
        div,
        {
          array: []
        },
        div
      );
    });
  });

  it('works with "in" separator', () => {
    const { target } = setupFixture(
      `<div id="target" :for="item in array">
        <span></span>
      </div>`,
      {
        array: [1]
      }
    );
    assert.lengthOf(target.children, 1);
  });

  it('works with "of" separator', () => {
    const { target } = setupFixture(
      `<div id="target" :for="item of array">
        <span></span>
      </div>`,
      {
        array: [1]
      }
    );
    assert.lengthOf(target.children, 1);
  });

  describe('array', () => {
    it('adds a child for each item of the array', () => {
      const { target } = setupFixture(
        `<div id="target" :for="item in array">
          <span></span>
        </div>`,
        {
          array: [1, 2, 3, 4]
        }
      );
      assert.lengthOf(target.children, 4);
      assert.isTrue(
        Array.from(target.children).every(
          node => node.nodeName.toLowerCase() === 'span'
        )
      );
    });

    it('processes the value', () => {
      const { target } = setupFixture(
        `<div id="target" :for="item in array">
          <span>{{ item }}</span>
        </div>`,
        {
          array: [1, 2, 3, 4]
        }
      );
      for (let i = 0; i < 4; i++) {
        assert.equal(target.children[i].textContent, i + 1);
      }
    });

    it('processes the value when object', () => {
      const { target } = setupFixture(
        `<div id="target" :for="item in array">
          <span>{{ item.text }}</span>
        </div>`,
        {
          array: [{ text: 1 }, { text: 2 }, { text: 3 }]
        }
      );
      for (let i = 0; i < 3; i++) {
        assert.equal(target.children[i].textContent, i + 1);
      }
    });

    it('processes the value and index', () => {
      const { target } = setupFixture(
        `<div id="target" :for="(item, index) in array">
          <span>{{ index }}.{{ item }}</span>
        </div>`,
        {
          array: [1, 2, 3, 4]
        }
      );
      for (let i = 0; i < 4; i++) {
        assert.equal(target.children[i].textContent, `${i}.${i + 1}`);
      }
    });

    it('defaults index to $index', () => {
      const { target } = setupFixture(
        `<div id="target" :for="item in array">
          <span>{{ $index }}.{{ item }}</span>
        </div>`,
        {
          array: [1, 2, 3, 4]
        }
      );
      for (let i = 0; i < 4; i++) {
        assert.equal(target.children[i].textContent, `${i}.${i + 1}`);
      }
    });

    it('processes the value and index as any name', () => {
      const { target } = setupFixture(
        `<div id="target" :for="(foobar, baz) in array">
          <span>{{ baz }}.{{ foobar }}</span>
        </div>`,
        {
          array: [1, 2, 3, 4]
        }
      );
      for (let i = 0; i < 4; i++) {
        assert.equal(target.children[i].textContent, `${i}.${i + 1}`);
      }
    });

    it('processes bindings on the nodes', () => {
      const { target } = setupFixture(
        `<div id="target" :for="(value, index) in array">
          <span :foo="count">{{ index }}.{{ value }}</span>
        </div>`,
        {
          count: 10,
          array: [1, 2, 3, 4]
        }
      );
      assert.isTrue(
        Array.from(target.children).every(node =>
          node.getAttribute('foo', '10')
        )
      );
    });

    it('does not render child with :if', () => {
      const { target } = setupFixture(
        `<div id="target" :for="(value, index) in array">
          <span :if="value">{{ index }}.{{ value }}</span>
        </div>`,
        {
          array: [1, 0, 0, 4]
        }
      );
      assert.lengthOf(target.children, 2);
    });

    it('handles bindings changing on the nodes', () => {
      const { target, host } = setupFixture(
        `<div id="target" :for="(value, index) in array">
          <span :foo="count">{{ index }}.{{ value }}</span>
        </div>`,
        {
          count: 10,
          array: [1, 2, 3, 4]
        }
      );
      host.$data.count = 20;
      assert.isTrue(
        Array.from(target.children).every(node =>
          node.getAttribute('foo', '20')
        )
      );
    });

    it('does not re-render the nodes when bindings change', () => {
      const { target, host } = setupFixture(
        `<div id="target" :for="(value, index) in array">
          <span :foo="count">{{ index }}.{{ value }}</span>
        </div>`,
        {
          count: 10,
          array: [1, 2, 3, 4]
        }
      );
      const nodes = Array.from(target.children);
      host.$data.count = 20;
      assert.isTrue(
        Array.from(target.children).every(
          (node, index) => node === nodes[index]
        )
      );
    });

    it('handles multiple children', () => {
      const { target } = setupFixture(
        `<div id="target" :for="(value, index) in array">
          <span>{{ value }}</span>
          <span>{{ index }}</span>
        </div>`,
        {
          array: [1, 2, 3, 4]
        }
      );
      assert.lengthOf(target.children, 8);
      assert.isTrue(
        Array.from(target.children).every(
          node => node.nodeName.toLowerCase() === 'span'
        )
      );
    });
  });

  describe('object', () => {
    it('adds a child for each key of the object', () => {
      const { target } = setupFixture(
        `<div id="target" :for="item in obj">
          <span></span>
        </div>`,
        {
          obj: {
            first_name: 'John',
            last_name: 'Doe',
            age: 'unknown',
            height: '5.9'
          }
        }
      );

      assert.lengthOf(target.children, 4);
      assert.isTrue(
        Array.from(target.children).every(
          node => node.nodeName.toLowerCase() === 'span'
        )
      );
    });

    it('processes the value', () => {
      const { target, host } = setupFixture(
        `<div id="target" :for="value in obj">
          <span>{{ value }}</span>
        </div>`,
        {
          obj: {
            first_name: 'John',
            last_name: 'Doe',
            age: 'unknown',
            height: '5.9'
          }
        }
      );

      const values = Object.values(host.$data.obj);
      for (let i = 0; i < 4; i++) {
        assert.equal(target.children[i].textContent, values[i]);
      }
    });

    it('processes the value and key', () => {
      const { target, host } = setupFixture(
        `<div id="target" :for="(value, key) in obj">
          <span>{{ key }}: {{ value }}</span>
        </div>`,
        {
          obj: {
            first_name: 'John',
            last_name: 'Doe',
            age: 'unknown',
            height: '5.9'
          }
        }
      );
      const entries = Object.entries(host.$data.obj);
      for (let i = 0; i < 4; i++) {
        assert.equal(
          target.children[i].textContent,
          `${entries[i][0]}: ${entries[i][1]}`
        );
      }
    });

    it('processes the value, key, and index', () => {
      const { target, host } = setupFixture(
        `<div id="target" :for="(value, key, index) in obj">
          <span>{{index}}. {{ key }}: {{ value }}</span>
        </div>`,
        {
          obj: {
            first_name: 'John',
            last_name: 'Doe',
            age: 'unknown',
            height: '5.9'
          }
        }
      );
      const entries = Object.entries(host.$data.obj);
      for (let i = 0; i < 4; i++) {
        assert.equal(
          target.children[i].textContent,
          `${i}. ${entries[i][0]}: ${entries[i][1]}`
        );
      }
    });

    it('processes the value, key, and index as any name', () => {
      const { target, host } = setupFixture(
        `<div id="target" :for="(foo, bar, baz) in obj">
          <span>{{baz}}. {{ bar }}: {{ foo }}</span>
        </div>`,
        {
          obj: {
            first_name: 'John',
            last_name: 'Doe',
            age: 'unknown',
            height: '5.9'
          }
        }
      );
      const entries = Object.entries(host.$data.obj);
      for (let i = 0; i < 4; i++) {
        assert.equal(
          target.children[i].textContent,
          `${i}. ${entries[i][0]}: ${entries[i][1]}`
        );
      }
    });

    it('processes bindings on the nodes', () => {
      const { target } = setupFixture(
        `<div id="target" :for="(value, key, index) in obj">
          <span :foo="count">{{index}}. {{ key }}: {{ value }}</span>
        </div>`,
        {
          count: 10,
          obj: {
            first_name: 'John',
            last_name: 'Doe',
            age: 'unknown',
            height: '5.9'
          }
        }
      );
      assert.isTrue(
        Array.from(target.children).every(node =>
          node.getAttribute('foo', '10')
        )
      );
    });

    it('does not render child with :if', () => {
      const { target, host } = setupFixture(
        `<div id="target" :for="(value, key, index) in obj">
          <span :if="index == 0 || index == 3">{{ key }}: {{ value }}</span>
        </div>`,
        {
          obj: {
            first_name: 'John',
            last_name: 'Doe',
            age: 'unknown',
            height: '5.9'
          }
        }
      );
      assert.lengthOf(target.children, 2);
    });

    it('handles bindings changing on the nodes', () => {
      const { target, host } = setupFixture(
        `<div id="target" :for="(value, key, index) in obj">
          <span :foo="count">{{index}}. {{ key }}: {{ value }}</span>
        </div>`,
        {
          count: 10,
          obj: {
            first_name: 'John',
            last_name: 'Doe',
            age: 'unknown',
            height: '5.9'
          }
        }
      );
      host.$data.count = 20;
      assert.isTrue(
        Array.from(target.children).every(node =>
          node.getAttribute('foo', '20')
        )
      );
    });

    it('does not re-render the nodes when bindings change', () => {
      const { target, host } = setupFixture(
        `<div id="target" :for="(value, key, index) in obj">
          <span :foo="count">{{index}}. {{ key }}: {{ value }}</span>
        </div>`,
        {
          count: 10,
          obj: {
            first_name: 'John',
            last_name: 'Doe',
            age: 'unknown',
            height: '5.9'
          }
        }
      );
      const nodes = Array.from(target.children);
      host.$data.count = 20;
      assert.isTrue(
        Array.from(target.children).every(
          (node, index) => node === nodes[index]
        )
      );
    });

    it('handles multiple children', () => {
      const { target, host } = setupFixture(
        `<div id="target" :for="(value, key, index) in obj">
          <span>{{ index }}</span>
          <span>{{ key }}</span>
          <span>{{ value }}</span>
        </div>`,
        {
          obj: {
            first_name: 'John',
            last_name: 'Doe',
            age: 'unknown',
            height: '5.9'
          }
        }
      );
      assert.lengthOf(target.children, 12);
      assert.isTrue(
        Array.from(target.children).every(
          node => node.nodeName.toLowerCase() === 'span'
        )
      );
    });
  });

  describe('when the binding changes', () => {
    it('does not re-render the element', () => {
      const { target, host } = setupFixture(
        `<div id="target" :for="item in array">
          <span></span>
        </div>`,
        {
          array: [1, 2, 3, 4]
        }
      );
      host.$data.array.push(5);
      assert.equal(target, host.querySelector('#target'));
    });

    it('updates child nodes', () => {
      const { target, host } = setupFixture(
        `<div id="target" :for="item in array">
          <span></span>
        </div>`,
        {
          array: [1, 2, 3, 4]
        }
      );
      host.$data.array.push(5);
      assert.lengthOf(target.children, 5);
      assert.isTrue(
        Array.from(target.children).every(
          node => node.nodeName.toLowerCase() === 'span'
        )
      );
    });

    it('removes child nodes', () => {
      const { target, host } = setupFixture(
        `<div id="target" :for="item in array">
          <span></span>
        </div>`,
        {
          array: [1, 2, 3, 4]
        }
      );
      host.$data.array.length = 2;
      assert.lengthOf(target.children, 2);
    });

    it('removes child nodes with :key', () => {
      const { target, host } = setupFixture(
        `<div id="target" :for="item in array" :key="item">
          <span></span>
        </div>`,
        {
          array: [1, 2, 3, 4]
        }
      );
      host.$data.array.length = 2;
      assert.lengthOf(target.children, 2);
    });

    it('handles sparse arrays', () => {
      const { target, host } = setupFixture(
        `<div id="target" :for="item in array" :key="item">
          <span></span>
        </div>`,
        {
          array: [1, 2, , , 3, 4]
        }
      );
      host.$data.array[10] = 7;
      assert.lengthOf(target.children, 5);
    });

    it('updates all children without :key', () => {
      const { target, host } = setupFixture(
        `<div id="target" :for="item in array">
          <span></span>
        </div>`,
        {
          array: [1, 2, 3, 4]
        }
      );
      const children = [...target.children];
      host.$data.array.push(5);
      assert.isFalse(
        Array.from(target.children).some(
          (child, index) => child === children[index]
        )
      );
    });

    it('only updates the changed child with :key (modification)', () => {
      const { target, host } = setupFixture(
        `<div id="target" :for="item in array" :key="item">
          <span></span>
        </div>`,
        {
          array: [1, 2, 3, 4]
        }
      );
      const children = [...target.children];
      host.$data.array[2] = 6;
      assert.isTrue(
        Array.from(target.children).every((child, index) => {
          if (index === 2) {
            return true;
          }

          return child === children[index];
        })
      );
      assert.isFalse(target.children[2] === children[2]);
    });

    it('only updates the changed child with :key (addition)', () => {
      const { target, host } = setupFixture(
        `<div id="target" :for="item in array" :key="item">
          <span></span>
        </div>`,
        {
          array: [1, 2, 3, 4]
        }
      );
      const children = [...target.children];
      host.$data.array.push(5);
      assert.isTrue(
        Array.from(target.children).every((child, index) => {
          if (index >= 4) {
            return true;
          }

          return child === children[index];
        })
      );
    });

    it(':key works with object iterator', () => {
      const { target, host } = setupFixture(
        `<div id="target" :for="(value, key, index) in obj" :key="value">
          <span></span>
        </div>`,
        {
          obj: {
            first_name: 'John',
            last_name: 'Doe',
            age: 'unknown',
            height: '5.9'
          }
        }
      );
      const children = [...target.children];
      host.$data.obj.weight = 150;
      assert.isTrue(
        Array.from(target.children).every((child, index) => {
          if (index >= 4) {
            return true;
          }

          return child === children[index];
        })
      );
    });

    it(':key works with object as :key', () => {
      const { target, host } = setupFixture(
        `<div id="target" :for="item in array" :key="item.id">
          <span></span>
        </div>`,
        {
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
      );
      const children = [...target.children];
      host.$data.array.push(5);
      assert.isTrue(
        Array.from(target.children).every((child, index) => {
          if (index >= 4) {
            return true;
          }

          return child === children[index];
        })
      );
    });

    it('does not replace node when sub-binding updates', () => {
      const { target, host } = setupFixture(
        `<div id="target" :for="item in array" :key="item.id">
          <span>{{ item.first_name }}</span>
        </div>`,
        {
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
      );
      const children = [...target.children];
      host.$data.array[2].first_name = 'Bob';
      assert.isTrue(target.children[2] === children[2]);
      assert.equal(target.children[2].textContent, 'Bob');
    });
  });

  it('updates the changed child value with :key', () => {
    const { target, host } = setupFixture(
      `<div id="target" :for="item in array" :key="item">
        <span>{{ item }}</span>
      </div>`,
      {
        array: [1, 2, 3, 4]
      }
    );
    host.$data.array[2] = 7;
    assert.equal(target.children[2].textContent, 7);
  });
});
