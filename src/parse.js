import { variableName } from './utils.js';

// match a variable path
// 1. Match a dot, array access, or optional chain (e.g. allow "state.b",
//    "state['b']", and "state?.thing" to match as a single path)
//
//                                                1
//                                    ┏━━━━━━━━━━━┻━━━━━━━━━━┓
const pathRegexStr = `(${variableName}(\\?*\\.|\\[[^\\]]+\\])*)+`;

// throw out any match that ends with a "(" (i.e. a function call)
// @see https://stackoverflow.com/a/48140275/2124254
const pathRegex = new RegExp(
  `(?!${pathRegexStr}\\s*\\()${pathRegexStr}`,
  'gu'
);

export default function parse(scope, exp) {
  const accessedPaths = [];
  return (exp.match(pathRegex) ?? [])
    .map(path => {
      let obj = scope;
      // split by dot, array access, or optional chain
      const parts = path.split(/[?.\[\]'"]/).filter(part => !!part);
      const key = parts.pop();
      for (const part of parts) {
        obj = obj[part];
        if (!obj) return;
      }

      // return the object and not the proxy
      return { obj: obj.__s ?? obj, key };
    })
    .filter(part => !!part);
}
