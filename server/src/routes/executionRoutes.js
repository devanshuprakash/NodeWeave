const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  executeWorkflow,
  getExecutions,
  getExecutionById,
  getExecutionLogs,
} = require('../controllers/executionController');

const router = express.Router();

router.use(protect); // All execution routes are protected

router.get('/', getExecutions);
router.get('/:id', getExecutionById);
router.get('/:id/logs', getExecutionLogs);
router.post('/:workflowId/execute', executeWorkflow);

module.exports = router;
