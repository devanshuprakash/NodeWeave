/**
 * BaseNodeExecutor — Abstract base class for all node executors
 * Implements the Strategy Pattern
 */
class BaseNodeExecutor {
  constructor(type) {
    this.type = type;
    if (new.target === BaseNodeExecutor) {
      throw new Error('BaseNodeExecutor is abstract and cannot be instantiated directly');
    }
  }

  /**
   * Execute the node logic
   * @param {Object} input - Data from parent nodes
   * @param {Object} config - Node configuration
   * @param {Object} context - { workflowId, nodeId, executionId }
   * @returns {Object} Output data to pass to child nodes
   */
  async execute(input, config, context) {
    throw new Error('execute() must be implemented by subclass');
  }
}

module.exports = BaseNodeExecutor;
