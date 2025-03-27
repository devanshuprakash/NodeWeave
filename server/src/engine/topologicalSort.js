/**
 * Topological Sort — Kahn's Algorithm
 * Returns nodes in execution order (dependencies first)
 */

class TopologicalSort {
  /**
   * @param {Array} nodes - Array of node objects with _id
   * @param {Array} edges - Array of edge objects with { source, target }
   * @returns {string[]} Ordered array of node IDs
   */
  static sort(nodes, edges) {
    const nodeIds = nodes.map((n) => n._id.toString());
    const inDegree = {};
    const adjacency = {};

    // Initialize
    for (const id of nodeIds) {
      inDegree[id] = 0;
      adjacency[id] = [];
    }

    // Build graph
    for (const edge of edges) {
      const src = edge.source.toString();
      const tgt = edge.target.toString();
      adjacency[src].push(tgt);
      inDegree[tgt]++;
    }

    // Start with nodes that have no incoming edges
    const queue = [];
    for (const id of nodeIds) {
      if (inDegree[id] === 0) {
        queue.push(id);
      }
    }

    const sorted = [];

    while (queue.length > 0) {
      const current = queue.shift();
      sorted.push(current);

      for (const neighbor of adjacency[current]) {
        inDegree[neighbor]--;
        if (inDegree[neighbor] === 0) {
          queue.push(neighbor);
        }
      }
    }

    return sorted;
  }
}

module.exports = TopologicalSort;
