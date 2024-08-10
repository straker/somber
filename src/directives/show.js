import bindDirective from './bind.js';

/**
 * Conditionally show or hide the HTML element. A truthy value will show the element while a falsey value will hide it. This works differently than the :if directive as the element remains in the DOM whether it's visible or not.
 *
 * Updates to the value will reprocess the directive and either show or hide it based on the updated value.
 *
 * @example
 * <span :show="!isHidden"></span>
 *
 * @section Show
 * @sectionof Directives
 */
export default function ifDirective(
  reactiveNode,
  scope,
  directiveNode,
  name,
  exp
) {
  bindDirective(
    reactiveNode,
    scope,
    directiveNode,
    'hidden',
    exp,
    true
  );
}
