const { Worker } = require('bullmq');
const { getRedisConnection } = require('../config/redis');
const ExecutionEngine = require('../engine/executionEngine');
const Execution = require('../models/Execution');

const startWorker = () => {
  const worker = new Worker(
    'workflow-execution',
    async (job) => {
      const { workflowId, executionId } = job.data;
      console.log(`🔄 Worker processing execution: ${executionId} for workflow: ${workflowId}`);

      // Update status to RUNNING
      await Execution.findByIdAndUpdate(executionId, { status: 'RUNNING' });

      // Execute the workflow
      const result = await ExecutionEngine.executeWorkflow(workflowId, executionId);

      console.log(`✅ Execution ${executionId} completed with status: ${result.status}`);
      return { status: result.status };
    },
    {
      connection: getRedisConnection(),
      concurrency: 5,
    }
  );

  worker.on('completed', (job, result) => {
    console.log(`📦 Job ${job.id} completed:`, result);
  });

  worker.on('failed', async (job, err) => {
    console.error(`❌ Job ${job.id} failed:`, err.message);
    const { executionId } = job.data;
    try {
      await Execution.findByIdAndUpdate(executionId, {
        status: job.attemptsMade < job.opts.attempts ? 'RETRIED' : 'FAILED',
        error: err.message,
        retryCount: job.attemptsMade,
      });
    } catch (updateErr) {
      console.error('Failed to update execution status:', updateErr.message);
    }
  });

  worker.on('error', (err) => {
    console.error('Worker error:', err.message);
  });

  console.log('🏭 Workflow execution worker started');
  return worker;
};

module.exports = { startWorker };
