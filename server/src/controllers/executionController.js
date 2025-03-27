const Execution = require('../models/Execution');
const ExecutionLog = require('../models/ExecutionLog');
const Workflow = require('../models/Workflow');
const Node = require('../models/Node');
const Edge = require('../models/Edge');
const GraphValidator = require('../engine/graphValidator');
const ExecutionEngine = require('../engine/executionEngine');
const { AppError } = require('../middleware/errorHandler');

// Conditionally import queue (only if Redis is available)
let getWorkflowQueue;
try {
  ({ getWorkflowQueue } = require('../config/queue'));
} catch (err) {
  getWorkflowQueue = null;
}

/**
 * @route   POST /api/v1/executions/:workflowId/execute
 * @desc    Execute a workflow
 */
const executeWorkflow = async (req, res, next) => {
  try {
    const { workflowId } = req.params;

    // Verify workflow exists and belongs to user
    const workflow = await Workflow.findOne({ _id: workflowId, userId: req.user._id });
    if (!workflow) {
      throw new AppError('Workflow not found', 404);
    }

    // Validate graph before execution
    const nodes = await Node.find({ workflowId });
    const edges = await Edge.find({ workflowId });
    const validation = GraphValidator.validate(nodes, edges);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Workflow validation failed',
        details: validation.errors,
      });
    }

    // Create execution record
    const execution = await Execution.create({
      workflowId,
      userId: req.user._id,
      status: 'CREATED',
    });

    // Try to queue the job (async via BullMQ), fallback to sync execution
    if (getWorkflowQueue) {
      try {
        const queue = getWorkflowQueue();
        await queue.add('execute-workflow', {
          workflowId: workflowId.toString(),
          executionId: execution._id.toString(),
        });
        execution.status = 'QUEUED';
        await execution.save();
      } catch (queueErr) {
        // Redis not available, execute synchronously
        console.log('⚠️  Redis unavailable, executing synchronously');
        await ExecutionEngine.executeWorkflow(workflowId, execution._id);
      }
    } else {
      // No queue available, execute synchronously
      await ExecutionEngine.executeWorkflow(workflowId, execution._id);
    }

    const updatedExecution = await Execution.findById(execution._id);
    res.status(202).json({ success: true, data: updatedExecution });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/v1/executions
 * @desc    Get all executions for the current user
 */
const getExecutions = async (req, res, next) => {
  try {
    const executions = await Execution.find({ userId: req.user._id })
      .populate('workflowId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: executions.length, data: executions });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/v1/executions/:id
 * @desc    Get a single execution with logs
 */
const getExecutionById = async (req, res, next) => {
  try {
    const execution = await Execution.findOne({ _id: req.params.id, userId: req.user._id })
      .populate('workflowId', 'name');

    if (!execution) {
      throw new AppError('Execution not found', 404);
    }

    const logs = await ExecutionLog.find({ executionId: execution._id })
      .populate('nodeId', 'label type')
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, data: { execution, logs } });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/v1/executions/:id/logs
 * @desc    Get execution logs
 */
const getExecutionLogs = async (req, res, next) => {
  try {
    const execution = await Execution.findOne({ _id: req.params.id, userId: req.user._id });
    if (!execution) {
      throw new AppError('Execution not found', 404);
    }

    const logs = await ExecutionLog.find({ executionId: execution._id })
      .populate('nodeId', 'label type')
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    next(error);
  }
};

module.exports = { executeWorkflow, getExecutions, getExecutionById, getExecutionLogs };
