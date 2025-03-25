const mongoose = require('mongoose');

const executionLogSchema = new mongoose.Schema(
  {
    executionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Execution',
      required: true,
      index: true,
    },
    nodeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Node',
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'RUNNING', 'SUCCESS', 'FAILED', 'SKIPPED'],
      default: 'PENDING',
    },
    message: {
      type: String,
      default: '',
    },
    input: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    output: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    startedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    duration: {
      type: Number, // milliseconds
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

executionLogSchema.index({ executionId: 1, createdAt: 1 });

module.exports = mongoose.model('ExecutionLog', executionLogSchema);
