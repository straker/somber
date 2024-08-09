# Contributing

By participating in this project you agree to abide by the terms in the [Contributor Code of Conduct](CODE_OF_CONDUCT.md). 

## Goal

The goal of Somber is not to implement everything you could possibly need. After all, Vue.js already does that.

Instead, Somber aims to implement basic requirements for data binding and reactivity. This allows it to be used when your file size is limited.

### Features Kontra Won't Support

Below is a list of features the library will not support or add:

- else / else if directives
- on directive using `on` keyword (use `@`)
- bind directive using `bind` keyword (use `:`)
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
