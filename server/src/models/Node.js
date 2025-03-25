const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema(
  {
    workflowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workflow',
      required: true,
    },
    type: {
      type: String,
      enum: ['document_upload', 'ai_processing', 'conditional', 'email', 'log'],
      required: [true, 'Node type is required'],
    },
    label: {
      type: String,
      required: [true, 'Node label is required'],
      trim: true,
      maxlength: [100, 'Label cannot exceed 100 characters'],
    },
    config: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    position: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

nodeSchema.index({ workflowId: 1 });

module.exports = mongoose.model('Node', nodeSchema);
