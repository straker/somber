import evaluate from '../evaluate.js';
import parse from '../parse.js';
import { emit } from '../events.js';

/**
 * Two-way bind an HTML input element property to a value. Can only be used on `<input>`, `<select>`, and `<textarea>` elements. The property being bound and when the value updates depends on the element and element's type.
 *
 * @example
 * <!-- bind a value to the `checked` property -->
 * <input type="radio" :model="checkedState">
 *
 * <!-- bind a value to the `value` property -->
 * <input type="text" :model="valueText">
 *
 * <!-- bind a value to the `value` property of select -->
 * <select :model="value"></select>
 *
 * @section Model
 * @sectionof Directives
 */
export default function modelDirective(
  reactiveNode,
  scope,
  directiveNode,
  name,
  exp
) {
  const useCheckedProp = ['checkbox', 'radio'].includes(
    directiveNode.type
  );
  const useChangeEvent =
    useCheckedProp || directiveNode.nodeName == 'SELECT';
  const event = useChangeEvent ? 'change' : 'input';
  const prop = useCheckedProp ? 'checked' : 'value';
  const value = evaluate(scope, exp);

  // model can only bind to a single path
  parse(scope, exp).map(({ obj, key }) => {
    directiveNode.addEventListener(event, () => {
      obj[key] = directiveNode[prop];
      emit(obj, key);
    });
  });

  if (value) {
    directiveNode[prop] = value;
  }
}
