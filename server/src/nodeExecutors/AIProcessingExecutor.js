const BaseNodeExecutor = require('./BaseNodeExecutor');

class AIProcessingExecutor extends BaseNodeExecutor {
  constructor() {
    super('ai_processing');
  }

  async execute(input, config, context) {
    const AIService = require('../services/aiService');
    const action = config.action; // 'extract_invoice', 'classify_email', 'summarize'

    let result;

    switch (action) {
      case 'extract_invoice':
        result = await AIService.extractInvoiceData(input.text || config.text || '');
        return { extractedData: result, action };

      case 'classify_email':
        result = await AIService.classifyEmail(input.text || config.text || '');
        return { classification: result, action };

      case 'summarize':
        result = await AIService.summarizeText(input.text || config.text || '');
        return { summary: result, action };

      default:
        throw new Error(`Unknown AI action: ${action}. Supported: extract_invoice, classify_email, summarize`);
    }
  }
}

module.exports = AIProcessingExecutor;
