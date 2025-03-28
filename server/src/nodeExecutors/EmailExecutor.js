const BaseNodeExecutor = require('./BaseNodeExecutor');

class EmailExecutor extends BaseNodeExecutor {
  constructor() {
    super('email');
  }

  async execute(input, config, context) {
    const emailService = require('../services/emailService');

    const to = config.to || input.email;
    const subject = config.subject || 'NodeWeave Notification';
    const body = config.body || `Workflow execution update:\n${JSON.stringify(input, null, 2)}`;

    if (!to) {
      throw new Error('Email node requires a "to" address in config or input');
    }

    await emailService.sendEmail({ to, subject, body });

    return {
      emailSent: true,
      to,
      subject,
      message: `Email sent to ${to}`,
    };
  }
}

module.exports = EmailExecutor;
