# Contributing

By participating in this project you agree to abide by the terms in the [Contributor Code of Conduct](CODE_OF_CONDUCT.md). 

## Goal

The goal of Somber is not to implement everything you could possibly need. After all, Vue.js already does that.

Instead, Somber aims to implement basic requirements for data binding and reactivity. This allows it to be used when your file size is limited.

### Features Kontra Won't Support

Below is a list of features the library will not support or add:

- else / else if directives
- if and for directives on `<template>` element

## Code Style

To help keep the code small the library follows some unconventional code patterns. Take a look at these [byte-saving techniques](https://github.com/jed/140bytes/wiki/Byte-saving-techniques) and follow these recommendations:

- Prefer `==` over `===` (save a byte)
- Prefer `!=` over `==` (save a byte)
- Prefer `let` over `const`  (save a byte)
- Prefer `Array.map()` over `Array.forEach()`

The library uses [eslint](.eslintrc.js) to help enforce these codes styles. To run eslint, run `npm run eslint`.

## Building

To build the development code, run `npm run build`. To build the distribution version of the code, run `npm run dist`.

## Testing

Please add unit and/or integration tests for all new changes. To run the tests, run `npm test`.

## Exports

Please update the export files for all new changes (if need be). [somber.defaults.js](src/somber.defaults.js) imports all functionality and then adds it to the `somber` object. [somber.js](src/somber.js) exports all functionality directly. You will also need to add tests to their respected spec files to ensure the functionality is exported.

## Documentation and TypeScript Declaration File

The [documentation](/docs) and the [TypeScript declaration file](kontra.d.ts) are built from the JSDoc-like comments in the source files using [LivingCSS](https://github.com/straker/livingcss) (I know, not what it was intended for but it makes it really easy to build multiple pages of docs. And it's highly configurable). Both are built when running `npm run build`.

To update the documentation or the declaration file, just modify the JSDoc-like comments. The comments are not true JSDoc syntax, but a modified version that supports both JSDoc tags and TypeSript declarations. For example, a comment for an object will be declared using TypeSript for the JSDoc type.

```js
/**
 * @param {{x: number, y: number}} [properties.anchor={x:0,y:0}] - The x and y origin of the game object. {x:0, y:0} is the top left corner of the game object, {x:1, y:1} is the bottom right corner.
 */
```

The documentation will automatically read the TypeScript type and say it's an Object, while the declaration file will take the type directly.

```html
<!-- docs -->
<dt>
    <code>properties.anchor</code>
    <span class="optional">Optional</span>
</dt>
<dd>
    <p>Object. The x and y origin of the game object. {x:0, y:0} is the top left corner of the game object, {x:1, y:1} is the bottomright corner. Defaults to <code>{x:0,y:0}</code>.
    </p>
</dd>
```

```ts
// kontra.d.ts
interface GameObject{
    anchor: {x: number, y: number};
}
```

All documentation related gulp tasks and `@tag` information can be found in [tasks/doc.js](tasks/docs.js). All TypeScript related gulp tasks and `@tag` information can be found in [tasks/typescript.js](tasks/typescript.js).

### TypeScript Code Style

Use uppercase for the first letter of each basic type: `Number`, `Boolean`, `String`, `Object`, `Function`.

If the type is a `Function` and takes no arguments and doesn't return anything, use `Function`. Otherwise declare the arguments and return using the syntax `(params: Type) => ReturnType`. 

```js
/** 
 * @param {(dt?: Number) => void} update - Function called every frame to update the game. Is passed the fixed `dt` as a parameter.
 * @param {Function} render - Function called every frame to render the game. 
 */
```

If the type is an Object and can take any number of properties, use `Object`. Otherwise declare the properties of the object using the syntax `{key: Type}`.

```js
/**
 * @param {Object} [properties] - Properties of the quadtree.
 * @param {{x: Number, y: Number, width: Number, height: Number}} [properties.bounds] - The 2D space (x, y, width, height) the quadtree occupies. Defaults to the entire canvas width and height.
 */
```

