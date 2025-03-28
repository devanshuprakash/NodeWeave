const { OPENAI_API_KEY } = require('../config/env');

/**
 * AI Service — wraps AI API calls for the workflow engine
 * Uses OpenAI API (or can be swapped for Gemini)
 */
class AIService {
  /**
   * Extract structured data from invoice text
   */
  static async extractInvoiceData(text) {
    if (!text) throw new Error('No text provided for invoice extraction');

    // If API key is configured, use OpenAI
    if (OPENAI_API_KEY && OPENAI_API_KEY !== 'your_openai_api_key_here') {
      const OpenAI = require('openai');
      const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Extract invoice data from the following text. Return a JSON object with fields: invoiceNumber, date, vendor, items (array of {description, quantity, unitPrice, total}), subtotal, tax, totalAmount, currency.',
          },
          { role: 'user', content: text },
        ],
        response_format: { type: 'json_object' },
      });

      return JSON.parse(response.choices[0].message.content);
    }

    // Fallback: mock response for development
    return {
      invoiceNumber: 'INV-MOCK-001',
      date: new Date().toISOString().split('T')[0],
      vendor: 'Mock Vendor',
      items: [
        { description: 'Sample Item', quantity: 1, unitPrice: 100, total: 100 },
      ],
      subtotal: 100,
      tax: 10,
      totalAmount: 110,
      currency: 'USD',
      _isMock: true,
    };
  }

  /**
   * Classify email content
   */
  static async classifyEmail(text) {
    if (!text) throw new Error('No text provided for email classification');

    if (OPENAI_API_KEY && OPENAI_API_KEY !== 'your_openai_api_key_here') {
      const OpenAI = require('openai');
      const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Classify the following email into one of these categories: inquiry, complaint, approval_request, notification, spam, urgent. Return a JSON object with fields: category, confidence (0-1), reason.',
          },
          { role: 'user', content: text },
        ],
        response_format: { type: 'json_object' },
      });

      return JSON.parse(response.choices[0].message.content);
    }

    // Fallback mock
    return {
      category: 'notification',
      confidence: 0.85,
      reason: 'Mock classification — configure OPENAI_API_KEY for real results',
      _isMock: true,
    };
  }

  /**
   * Summarize text
   */
  static async summarizeText(text) {
    if (!text) throw new Error('No text provided for summarization');

    if (OPENAI_API_KEY && OPENAI_API_KEY !== 'your_openai_api_key_here') {
      const OpenAI = require('openai');
      const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Summarize the following text concisely. Return a JSON object with fields: summary, keyPoints (array of strings), wordCount.',
          },
          { role: 'user', content: text },
        ],
        response_format: { type: 'json_object' },
      });

      return JSON.parse(response.choices[0].message.content);
    }

    // Fallback mock
    return {
      summary: `Mock summary of ${text.substring(0, 50)}...`,
      keyPoints: ['This is a mock summary', 'Configure OPENAI_API_KEY for real results'],
      wordCount: text.split(' ').length,
      _isMock: true,
    };
  }
}

module.exports = AIService;
