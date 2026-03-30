const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  createWorkflow,
  getWorkflows,
  getWorkflowById,
  updateWorkflow,
  deleteWorkflow,
} = require('../controllers/workflowController');

const router = express.Router();

router.use(protect); // All workflow routes are protected

router.route('/')
  .get(getWorkflows)
  .post(createWorkflow);

router.route('/:id')
  .get(getWorkflowById)
  .put(updateWorkflow)
  .delete(deleteWorkflow);

module.exports = router;

