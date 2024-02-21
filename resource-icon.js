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
    this.state = { amount: 1000, max: 5000 };
    this.truncateNumber = truncateNumber;
  }

  render() {
    const name = 0;
    const icon = 1;
    const amount = 2;
    const max = 3;
    const data = this.props.data;

    return this.html(`<div :foo="1">hello</div>`);

    // return this.html(`
    //   <span>
    //     <span class="icon ${data[name]}">${data[icon]}</span>
    //     <span class="amount" :foo="this.amount">
    //       <span>{{ truncateNumber(state.amount) }}</span>
    //       <span :if="state.max">/</span>
    //       <span :if="state.max">{{ truncateNumber(state.max) }}</span>
    //     </span>
    //     <span class="tip res b" :class="{ unit: isUnit, r: index === skeletons }">
    //       <b>${data[name]}</b>:{{ props.data.change?.[0] ?? '0' }} every ${RESOURCE_TICK / 60} seconds
    //       <div if:"props.data.change.length > 1" class="res-list">
    //         <span :for="(value, index) of props.data.change">
    //           <span :key="index">
    //             <span>Name</span>
    //             <span>
    //               <span class="num">{{ value >= 0 ? '+' : '-' }}</span>{{ Math.abs(value) }}
    //             </span>
    //           </span>
    //         </span>
    //       </div>
    //     </span>
    //   </span>
    // `);

    // this.html(`
    //   <div>
    //     <div data-col="1">
    //       <span :if="state.locked" aria-hidden="true" hidden id="btn-desc-${type}-${index}">Locked. Requires {{ displayCost(state.cost) }}</span>
    //       <button class="tipC" :class="{ locked: state.locked }" data-name="${dashSeparate(buttonName)}" :aria-describedby="state.locked ? 'btn-desc-${type}-${index}' : null }">
    //         <span :if="state.locked" class="icon Lock"></span>
    //         <span :if="state.locked">{{ displayCost(state.cost) }}<span>
    //         <span>${buttonName}</span>
    //         <span class="cooldown" :style="{ width: props.data.timer / props.data.cooldown * 100 + '%' }"></span>
    //         <span class="sr-only">{{ getSeconds(props.data.timer) }}</span>
    //       </button>
    //     </div>
    //   </div>
    // `);
  }
}

customElements.define('resource-icon', ResourceIcon);