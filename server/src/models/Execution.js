const mongoose = require('mongoose');

const executionSchema = new mongoose.Schema(
  {
    workflowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workflow',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['CREATED', 'QUEUED', 'RUNNING', 'COMPLETED', 'FAILED', 'RETRIED'],
      default: 'CREATED',
    },
    startedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    error: {
      type: String,
      default: null,
    },
    retryCount: {
      type: Number,
      default: 0,
    },
    nodeOutputs: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: new Map(),
    },
  },
  {
    timestamps: true,
  }
);

executionSchema.index({ workflowId: 1, createdAt: -1 });
executionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Execution', executionSchema);
