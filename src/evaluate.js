const evalCache = {};
export default function evaluate(scope, exp) {
  if (exp === '') {
    exp = "''";
  }

  exp = `return(${exp})`;
  const fn = evalCache[exp] || (evalCache[exp] = toFunction(exp))
  try {
    return fn(scope)
  } catch (e) {
    console.warn(`Error when evaluating expression "${exp}":`)
    console.error(e)
  }
}

function toFunction(exp) {
  try {
    return new Function(`$data`, `with($data){${exp}}`)
  } catch (e) {
    console.error(`${e.message} in expression: ${exp}`)
    return () => {}
  }
}