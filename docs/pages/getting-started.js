/**

Somber is written for modern ES6 capable browsers. If you need to run it in an ES5 browser, you will have to [transpile](https://babeljs.io/) and polyfill needed ES6 features.

## Download

- Global object [production](https://unpkg.com/somber@latest/somber.min.js) and [development](https://unpkg.com/somber@latest/somber.js) versions
- ES module [production](https://unpkg.com/somber@latest/somber.min.mjs) and [development](https://unpkg.com/somber@latest/somber.mjs) versions
- `npm install somber`
- `yarn add somber`

## Load

There are a few different ways to load the library depending on how you are going to use it.

### Global Object

Load the library by adding it as a script tag. This will add a global `somber` object to the page with all somber functions and properties.

```html
<script src="path/to/somber.js"></script>
<script>
const { SomberElement } = somber;
</script>
```

### ES Module Import

Somber also supports ES modules and exports all API functions, allowing you to import it into your code as well. Import the file `somber.mjs` and either use the entire `somber` object or just import the functions you need.

```js
import { SoberElement } from 'path/to/somber.mjs';
```

### Module Bundler

If you're using a module bundler that supports npm dependency resolution (such as Webpack or Parcel), you can import the library directly from the module name. This is the recommended way to create [custom builds](download) of the library.

```js
import { SomberElement } from 'somber';
```

## Create a Reactive Custom Component

Start by grabbing `SomberElement`.

```js
import { SomberElement } from 'somber';
```

Once imported, you can use it to create a reactive custom component in just a few lines of code. The following code creates a button which updates the text to show how many times it's been clicked.

```js
customElements.define(
 'counter-button',
 class CounterButton extends SomberElement {
   constructor() {
     super();
     this.state.count = 0;
   }

   render() {
     return this.html(`
       <button @click="state.count++">
         <span>Clicked {{ state.count }} time</span><span if="state.count != 1">s</span>
        </button>
      `);
    }
  }
);
```

@section Getting Started
@page getting-started
*/
