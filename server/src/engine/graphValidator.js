/**
 * Graph Validator — validates a workflow DAG
 * Uses Kahn's algorithm for cycle detection
 */

class GraphValidator {
  /**
   * Validate the workflow graph
   * @param {Array} nodes - Array of node objects with _id
   * @param {Array} edges - Array of edge objects with { source, target }
   * @returns {{ isValid: boolean, errors: string[] }}
   */
  static validate(nodes, edges) {
    const errors = [];

    if (!nodes || nodes.length === 0) {
      errors.push('Workflow must have at least one node');
      return { isValid: false, errors };
    }

    // Build set of valid node IDs
    const nodeIds = new Set(nodes.map((n) => n._id.toString()));

    // Validate all edge references exist
    for (const edge of edges) {
      const sourceId = edge.source.toString();
      const targetId = edge.target.toString();

      if (!nodeIds.has(sourceId)) {
        errors.push(`Edge references non-existent source node: ${sourceId}`);
      }
      if (!nodeIds.has(targetId)) {
        errors.push(`Edge references non-existent target node: ${targetId}`);
      }
      if (sourceId === targetId) {
        errors.push(`Self-loop detected on node: ${sourceId}`);
      }
    }

    if (errors.length > 0) {
      return { isValid: false, errors };
    }

    // Cycle detection using Kahn's algorithm
    const hasCycle = this.detectCycle(nodes, edges);
    if (hasCycle) {
      errors.push('Cycle detected in workflow graph — DAG required');
      return { isValid: false, errors };
    }

    return { isValid: true, errors: [] };
  }

  /**
   * Detect cycle using Kahn's algorithm (BFS-based topological sort)
   * If we can't visit all nodes, there's a cycle.
   */
  static detectCycle(nodes, edges) {
    const nodeIds = nodes.map((n) => n._id.toString());
    const inDegree = {};
    const adjacency = {};

    // Initialize
    for (const id of nodeIds) {
      inDegree[id] = 0;
      adjacency[id] = [];
    }

    // Build adjacency list and in-degree count
    for (const edge of edges) {
      const src = edge.source.toString();
      const tgt = edge.target.toString();
      adjacency[src].push(tgt);
      inDegree[tgt]++;
    }

    // Queue nodes with in-degree 0
    const queue = [];
    for (const id of nodeIds) {
      if (inDegree[id] === 0) {
        queue.push(id);
      }
    }

    let visitedCount = 0;

    while (queue.length > 0) {
      const current = queue.shift();
      visitedCount++;

      for (const neighbor of adjacency[current]) {
        inDegree[neighbor]--;
        if (inDegree[neighbor] === 0) {
          queue.push(neighbor);
        }
      }
    }

    // If we couldn't visit all nodes, there's a cycle
    return visitedCount !== nodeIds.length;
  }
}

module.exports = GraphValidator;
