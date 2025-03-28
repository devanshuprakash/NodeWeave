const BaseNodeExecutor = require('./BaseNodeExecutor');
const Document = require('../models/Document');

class DocumentUploadExecutor extends BaseNodeExecutor {
  constructor() {
    super('document_upload');
  }

  async execute(input, config, context) {
    // In a real implementation, this would handle file uploads to cloud storage
    // For now, it records the document reference
    const { fileName, fileUrl, mimeType } = config;

    if (!fileUrl) {
      throw new Error('Document Upload requires a fileUrl in config');
    }

    const document = await Document.create({
      workflowId: context.workflowId,
      fileName: fileName || 'uploaded_file',
      fileUrl,
      mimeType: mimeType || 'application/octet-stream',
    });

    return {
      documentId: document._id.toString(),
      fileUrl: document.fileUrl,
      fileName: document.fileName,
      message: `Document "${document.fileName}" uploaded successfully`,
    };
  }
}

module.exports = DocumentUploadExecutor;
