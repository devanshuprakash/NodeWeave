const { Queue } = require('bullmq');
const { getRedisConnection } = require('./redis');

let workflowQueue = null;

const getWorkflowQueue = () => {
  if (!workflowQueue) {
    workflowQueue = new Queue('workflow-execution', {
      connection: getRedisConnection(),
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: { count: 100 },
        removeOnFail: { count: 50 },
      },
    });
  }
  return workflowQueue;
};

module.exports = { getWorkflowQueue };
