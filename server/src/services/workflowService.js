const Workflow = require('../models/Workflow');
const Node = require('../models/Node');
const Edge = require('../models/Edge');
const { AppError } = require('../middleware/errorHandler');

class WorkflowService {
  /**
   * Create a new workflow with optional nodes and edges
   */
  static async createWorkflow(userId, { name, description, nodes, edges }) {
    const workflow = await Workflow.create({ name, description, userId });

    let createdNodes = [];
    let createdEdges = [];

    // Create nodes if provided
    if (nodes && nodes.length > 0) {
      const nodeData = nodes.map((node) => ({
        ...node,
        workflowId: workflow._id,
      }));
      createdNodes = await Node.insertMany(nodeData);
    }

    // Create edges if provided (map temp IDs to real IDs)
    if (edges && edges.length > 0 && createdNodes.length > 0) {
      // Build a map from temp index → real _id
      const nodeIdMap = {};
      nodes.forEach((n, i) => {
        const tempId = n.tempId || i.toString();
        nodeIdMap[tempId] = createdNodes[i]._id;
      });

      const edgeData = edges.map((edge) => ({
        workflowId: workflow._id,
        source: nodeIdMap[edge.source] || edge.source,
        target: nodeIdMap[edge.target] || edge.target,
        label: edge.label || '',
      }));
      createdEdges = await Edge.insertMany(edgeData);
    }

    return {
      workflow,
      nodes: createdNodes,
      edges: createdEdges,
    };
  }

  /**
   * Get all workflows for a user
   */
  static async getWorkflows(userId) {
    return Workflow.find({ userId }).sort({ createdAt: -1 });
  }

  /**
   * Get a single workflow with its nodes and edges
   */
  static async getWorkflowById(workflowId, userId) {
    const workflow = await Workflow.findOne({ _id: workflowId, userId });
    if (!workflow) {
      throw new AppError('Workflow not found', 404);
    }

    const nodes = await Node.find({ workflowId });
    const edges = await Edge.find({ workflowId });

    return { workflow, nodes, edges };
  }

  /**
   * Update a workflow (name, description, isActive, nodes, edges)
   */
  static async updateWorkflow(workflowId, userId, updateData) {
    const workflow = await Workflow.findOne({ _id: workflowId, userId });
    if (!workflow) {
      throw new AppError('Workflow not found', 404);
    }

    // Update basic fields
    if (updateData.name) workflow.name = updateData.name;
    if (updateData.description !== undefined) workflow.description = updateData.description;
    if (updateData.isActive !== undefined) workflow.isActive = updateData.isActive;
    await workflow.save();

    // Replace nodes if provided
    if (updateData.nodes) {
      await Node.deleteMany({ workflowId });
      const nodeData = updateData.nodes.map((node) => ({
        ...node,
        workflowId,
      }));
      const createdNodes = await Node.insertMany(nodeData);

      // Replace edges if provided
      if (updateData.edges) {
        await Edge.deleteMany({ workflowId });
        const nodeIdMap = {};
        updateData.nodes.forEach((n, i) => {
          const tempId = n.tempId || i.toString();
          nodeIdMap[tempId] = createdNodes[i]._id;
        });

        const edgeData = updateData.edges.map((edge) => ({
          workflowId,
          source: nodeIdMap[edge.source] || edge.source,
          target: nodeIdMap[edge.target] || edge.target,
          label: edge.label || '',
        }));
        await Edge.insertMany(edgeData);
      }
    }

    return this.getWorkflowById(workflowId, userId);
  }

  /**
   * Delete a workflow and all related nodes/edges
   */
  static async deleteWorkflow(workflowId, userId) {
    const workflow = await Workflow.findOne({ _id: workflowId, userId });
    if (!workflow) {
      throw new AppError('Workflow not found', 404);
    }

    await Node.deleteMany({ workflowId });
    await Edge.deleteMany({ workflowId });
    await Workflow.findByIdAndDelete(workflowId);

    return { message: 'Workflow deleted successfully' };
  }
}

module.exports = WorkflowService;
