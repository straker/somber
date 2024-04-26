import evaluate from '../evaluate.js';
import parse from '../parse.js';
import { emit } from '../events.js';

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
