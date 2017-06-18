export function createTree (...nodes): any {
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].firstChild = (i + 1 < nodes.length) ? nodes[i + 1] : null;
  }

  return nodes[0];
}
