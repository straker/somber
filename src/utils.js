/**
 * Create a marker in the DOM where the node should go
 */
export function markNode(node) {
  // b = before, a = after
  node.__b = document.createTextNode('');
  node.__a = document.createTextNode('');
  node.before(node.__b);
  node.after(node.__a);
}

/**
 * Get all nodes between the start mark to the end mark
 */
export function getNodesBetweenMark(node) {
  const nodes = [];
  let curNode = node.__b;
  while ((curNode = curNode.nextSibling) != node.__a) {
    nodes.push(curNode);
  }

  return nodes;
}
