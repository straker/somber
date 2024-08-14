// taken from https://github.com/vuejs/petite-vue/blob/main/src/eval.ts
const evalCache = {};
export default function evaluate(scope, exp) {
  if (exp == '') {
    exp = "''";
  }

  exp = `return(${exp})`;
  const fn = evalCache[exp] || (evalCache[exp] = toFunction(exp));
  try {
    return fn(scope);
  } catch (e) {
    // ignore undefined variables since $scope.var would be fine
    if (e instanceof ReferenceError && e.message.includes('is not defined')) {
      return;
    }
    console.warn(`Error when evaluating expression "${exp}":`);
    console.error(e);
  }
}

function toFunction(exp) {
  try {
    return new Function(`$scope`, `with($scope){with($scope.$data || {}){${exp}}}`);
  } catch (e) {
    console.error(`${e.message} in expression: ${exp}`);
    return () => {};
  }
}
