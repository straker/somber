import evaluate from '../evaluate.js';

/**
 * Add an event listener to an element. The event listener can be a function or an inline expression. Supports both native DOM events and custom events.
 *
 * When listening to native DOM events a function has access to the native DOM event as the first argument while an inline expression has access to it through the `$event` property.
 *
 * @example
 * <!-- function listener -->
 * <button @click="clickHandler">Register</button>
 *
 * <!-- inline expression -->
 * <button @click="count++">Increase counter</button>
 *
 * <!-- inline expression with $event property -->
 * <button @click="clickHandler($event)">Register</button>
 *
 * <!-- custom event -->
 * <button @custom-event="count++">Custom<button>
 *
 * @section Event
 * @sectionof Directives
 */
export default function eventDirective(
  _,
  scope,
  directiveNode,
  name,
  exp
) {
  directiveNode.addEventListener(name, $event => {
    const value = evaluate({ ...scope, $event }, exp);
    if (typeof value == 'function') {
      value($event);
    }
  });
}
