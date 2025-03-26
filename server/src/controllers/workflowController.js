const WorkflowService = require('../services/workflowService');

/**
 * @route   POST /api/v1/workflows
 */
const createWorkflow = async (req, res, next) => {
  try {
    const result = await WorkflowService.createWorkflow(req.user._id, req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/v1/workflows
 */
const getWorkflows = async (req, res, next) => {
  try {
    const workflows = await WorkflowService.getWorkflows(req.user._id);
    res.status(200).json({ success: true, count: workflows.length, data: workflows });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/v1/workflows/:id
 */
const getWorkflowById = async (req, res, next) => {
  try {
    const result = await WorkflowService.getWorkflowById(req.params.id, req.user._id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/v1/workflows/:id
 */
const updateWorkflow = async (req, res, next) => {
  try {
    const result = await WorkflowService.updateWorkflow(req.params.id, req.user._id, req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/v1/workflows/:id
 */
const deleteWorkflow = async (req, res, next) => {
  try {
    const result = await WorkflowService.deleteWorkflow(req.params.id, req.user._id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

module.exports = { createWorkflow, getWorkflows, getWorkflowById, updateWorkflow, deleteWorkflow };
