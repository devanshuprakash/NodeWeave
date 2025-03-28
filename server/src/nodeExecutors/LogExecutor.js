const BaseNodeExecutor = require('./BaseNodeExecutor');

class LogExecutor extends BaseNodeExecutor {
  constructor() {
    super('log');
  }

  async execute(input, config, context) {
    const logMessage = config.message || 'Log entry';
    const logLevel = config.level || 'info';

    const logEntry = {
      level: logLevel,
      message: logMessage,
      data: input,
      workflowId: context.workflowId,
      executionId: context.executionId,
      nodeId: context.nodeId,
      timestamp: new Date().toISOString(),
    };

    // Log to console (in production, this could go to a logging service)
    console.log(`📋 [${logLevel.toUpperCase()}] ${logMessage}`, JSON.stringify(logEntry, null, 2));

    return {
      logged: true,
      level: logLevel,
      message: logMessage,
      timestamp: logEntry.timestamp,
    };
  }
}

module.exports = LogExecutor;
