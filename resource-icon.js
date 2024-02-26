import CustomElement from './src/custom-element.js';

function truncateNumber(value) {
  return value < 1e3
    ? value | 0
    : value < 1e6
    ? (value / 1e3).toFixed(1) + 'K'
    : (value / 1e6).toFixed(1) + 'M'
}

class ResourceIcon extends CustomElement {
  static observedAttributes = ['data', 'hello', 'thing'];

  constructor() {
    super();
    this.state = {
      obj: {
        first_name: 'John',
        last_name: 'Doe',
        age: 'unknown',
        height: '5.9'
      },
      cost: 200,
      locked: true,
      timer: 2000,
      cooldown: 2000,
      list: ['one', 'two', 'three', 'four'],
      array: [{
        id: 0,
        first_name: 'John',
        last_name: 'Doe',
        age: 'unknown',
        height: '5.9'
      },
      {
        id: 1,
        first_name: 'Jane',
        last_name: 'Doe',
        age: 'unknown',
        height: '5.7'
      },
      {
        id: 2,
        first_name: 'Bob',
        last_name: 'Doe',
        age: 24,
        height: '5.9'
      },
      {
        id: 3,
        first_name: 'Billy',
        last_name: 'Doe',
        age: 15,
        height: '4.2'
      }],
      amount: 2521,
      max: 3000,
      change: [1, null, null, null, 6, -5],
      tasks: [{ name: 'Idle' }, { name: 'Woodcutter' }, { name: 'Carpenter' }, { name: 'Researcher' }, { name: 'Quarrier' }, { name: 'Mason' }, { name: 'Burner' }, { name: 'Miner' }, { name: 'Smelter' }, { name: 'Blacksmith' }, { name: 'Bowyer' }, { name: 'Weaponsmith' }, { name: 'Armorsmith' }, { name: 'Alchemist' }, { name: 'Snatcher' }, { name: 'Channeler' }]
    };
    this.truncateNumber = truncateNumber;

    // const int = setInterval(() => {
    //   this.state.timer -= 10;
    //   if (this.state.timer <= 0) {
    //     this.state.timer = 0;
    //     clearInterval(int);
    //   }
    // }, 50)
  }

  displayCost(cost) {
    return cost;
  }

  getSeconds(ms) {
    return ms / 1000;
  }

  render() {
    // return this.html(`
    //   <div id="target" :for="item in state.array" :key="item.id">
    //     <dl>
    //       <dt>first_name</dt>
    //       <dd>{{ item.first_name }}</dt>
    //     </dl>
    //   </div>
    // `);

    // return this.html(`
    //   <ul :for="(item, index) of list">
    //     <li>{{ index }}. {{ item }}</li>
    //   </ul>
    // `);

    // return this.html(`<div :foo="1">hello</div>`);

    return this.html(`
      <span>
        <span class="icon Wood">Wood</span>
        <span class="amount" :foo="this.amount">
          <span>{{ truncateNumber(state.amount) }}</span>
          <span>/</span>
          <span>{{ truncateNumber(state.max) }}</span>
        </span>
        <span class="tip res b">
          <b>Wood</b>:{{ state.change?.[0] ?? '0' }} every 10 seconds
          <div class="res-list">
            <span :for="(value, index) in state.change" :key="index">
              <span :if="value && index > 0">
                <span>{{ state.tasks[index].name }}</span>
                <span>
                  <span class="num">{{ value >= 0 ? '+' : '-' }}</span>{{ Math.abs(value) }}
                </span>
              </span>
            </span>
          </div>
        </span>
      </span>
    `);

    // return this.html(`
    //   <div>
    //     <div data-col="1">
    //       <span :if="state.locked" aria-hidden="true" hidden id="btn-desc-${type}-${index}">Locked. Requires {{ displayCost(state.cost) }} and {{state.timer}}</span>
    //       <button class="tipC" :class="{ locked: state.locked }" data-name="${dashSeparate(buttonName)}" :aria-describedby="state.locked ? 'btn-desc-${type}-${index}' : null">
    //         <span :if="state.locked" class="icon Lock"></span>
    //         <span :if="state.locked">{{ displayCost(state.cost) }}</span>
    //         <span>${buttonName}</span>
    //         <span class="cooldown" :style="{ width: state.timer / state.cooldown * 100 + '%' }"></span>
    //         <span class="sr-only">{{ getSeconds(state.timer) }}</span>
    //       </button>
    //     </div>
    //   </div>
    // `);
  }
}

customElements.define('resource-icon', ResourceIcon);