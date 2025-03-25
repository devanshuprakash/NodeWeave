const mongoose = require('mongoose');

const edgeSchema = new mongoose.Schema(
  {
    workflowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workflow',
      required: true,
    },
    source: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Node',
      required: [true, 'Source node is required'],
    },
    target: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Node',
      required: [true, 'Target node is required'],
    },
    label: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

edgeSchema.index({ workflowId: 1 });

module.exports = mongoose.model('Edge', edgeSchema);
