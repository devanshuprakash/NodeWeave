const DocumentUploadExecutor = require('./DocumentUploadExecutor');
const AIProcessingExecutor = require('./AIProcessingExecutor');
const ConditionalExecutor = require('./ConditionalExecutor');
const EmailExecutor = require('./EmailExecutor');
const LogExecutor = require('./LogExecutor');

/**
 * Node Executor Factory — Factory Pattern
 * Maps node type string → executor instance
 */
class NodeExecutorFactory {
  constructor() {
    this.executors = {
      document_upload: new DocumentUploadExecutor(),
      ai_processing: new AIProcessingExecutor(),
      conditional: new ConditionalExecutor(),
      email: new EmailExecutor(),
      log: new LogExecutor(),
    };
  }

  /**
   * Get the executor for a given node type
   * @param {string} type - Node type
   * @returns {BaseNodeExecutor} Executor instance
   */
  getExecutor(type) {
    const executor = this.executors[type];
    if (!executor) {
      throw new Error(`No executor found for node type: ${type}. Available types: ${Object.keys(this.executors).join(', ')}`);
    }
    return executor;
  }

  /**
   * Register a new executor (for extensibility)
   */
  registerExecutor(type, executor) {
    this.executors[type] = executor;
  }
}

// Singleton
module.exports = new NodeExecutorFactory();
