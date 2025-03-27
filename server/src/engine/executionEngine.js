const Node = require('../models/Node');
const Edge = require('../models/Edge');
const Execution = require('../models/Execution');
const ExecutionLog = require('../models/ExecutionLog');
const GraphValidator = require('./graphValidator');
const TopologicalSort = require('./topologicalSort');
const nodeExecutorFactory = require('../nodeExecutors/nodeExecutorFactory');
const { AppError } = require('../middleware/errorHandler');

class ExecutionEngine {
  /**
   * Execute an entire workflow
   * @param {string} workflowId
   * @param {string} executionId
   */
  static async executeWorkflow(workflowId, executionId) {
    const execution = await Execution.findById(executionId);
    if (!execution) {
      throw new AppError('Execution not found', 404);
    }

    const nodes = await Node.find({ workflowId });
    const edges = await Edge.find({ workflowId });

    // Step 1: Validate graph
    const validation = GraphValidator.validate(nodes, edges);
    if (!validation.isValid) {
      execution.status = 'FAILED';
      execution.error = validation.errors.join('; ');
      execution.completedAt = new Date();
      await execution.save();
      return execution;
    }

    // Step 2: Topological sort
    const sortedNodeIds = TopologicalSort.sort(nodes, edges);

    // Build node map for quick lookup
    const nodeMap = {};
    for (const node of nodes) {
      nodeMap[node._id.toString()] = node;
    }

    // Build adjacency map (reverse: who feeds into this node)
    const parentMap = {};
    for (const edge of edges) {
      const tgt = edge.target.toString();
      if (!parentMap[tgt]) parentMap[tgt] = [];
      parentMap[tgt].push(edge.source.toString());
    }

    // Step 3: Execute nodes in order
    execution.status = 'RUNNING';
    execution.startedAt = new Date();
    await execution.save();

    const nodeOutputs = new Map();

    try {
      for (const nodeId of sortedNodeIds) {
        const node = nodeMap[nodeId];
        if (!node) continue;

        // Gather inputs from parent nodes
        const parentIds = parentMap[nodeId] || [];
        const input = {};
        for (const pid of parentIds) {
          if (nodeOutputs.has(pid)) {
            Object.assign(input, nodeOutputs.get(pid));
          }
        }

        // Create execution log entry
        const log = await ExecutionLog.create({
          executionId,
          nodeId: node._id,
          status: 'RUNNING',
          input,
          startedAt: new Date(),
        });

        try {
          // Get the right executor for this node type (Strategy Pattern)
          const executor = nodeExecutorFactory.getExecutor(node.type);
          const output = await executor.execute(input, node.config, {
            workflowId,
            nodeId: node._id,
            executionId,
          });

          // Store output for downstream nodes
          nodeOutputs.set(nodeId, output || {});

          // Update log
          log.status = 'SUCCESS';
          log.output = output;
          log.message = `Node ${node.label} executed successfully`;
          log.completedAt = new Date();
          log.duration = log.completedAt - log.startedAt;
          await log.save();
        } catch (nodeError) {
          log.status = 'FAILED';
          log.message = nodeError.message;
          log.completedAt = new Date();
          log.duration = log.completedAt - log.startedAt;
          await log.save();

          throw nodeError; // Fail the entire execution
        }
      }

      // All nodes succeeded
      execution.status = 'COMPLETED';
      execution.completedAt = new Date();
      execution.nodeOutputs = nodeOutputs;
      await execution.save();
    } catch (error) {
      execution.status = 'FAILED';
      execution.error = error.message;
      execution.completedAt = new Date();
      await execution.save();
    }

    return execution;
  }
}

module.exports = ExecutionEngine;
