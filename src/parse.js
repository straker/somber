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
  const paths = [];
  (exp.match(pathRegex) ?? [])
    .map(path => {
      // split by dot, array access, or optional chain
      const parts = path.split(/[?.\[\]'"]/).filter(part => !!part);
      const key = parts.pop();

      // part or key does not exist in either, so return both
      // in case it will be added later
      let part = parts[0] ?? key;
      if (
        scope.$data &&
        !(part in scope.$data) &&
        !(part in scope)
      ) {
        paths.push({ obj: scope.$data.__s ?? scope.$data, key });
        paths.push({ obj: scope.__s ?? scope, key });
        return;
      }

      // try both scope.$data (inner scope of evaluate) and scope (outer scope)
      let obj = scope.$data && (parts[0] ?? key) in scope.$data
        ? scope.$data
        : scope;

      for (const part of parts) {
        obj = obj[part];
        if (!obj) return;
      }

      // return the object and not the proxy
      paths.push({ obj: obj.__s ?? obj, key });
    });

  return paths;
}
