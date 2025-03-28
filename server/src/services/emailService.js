const nodemailer = require('nodemailer');
const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM } = require('../config/env');

class EmailService {
  static getTransporter() {
    return nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });
  }

  /**
   * Send an email
   * @param {Object} options - { to, subject, body }
   */
  static async sendEmail({ to, subject, body }) {
    if (!to) throw new Error('Email recipient is required');

    // In development without SMTP config, just log
    if (!EMAIL_HOST || EMAIL_HOST === 'smtp.mailtrap.io') {
      console.log('📧 Email (dev mode):');
      console.log(`   To: ${to}`);
      console.log(`   Subject: ${subject}`);
      console.log(`   Body: ${body}`);
      return { messageId: `dev-${Date.now()}`, preview: true };
    }

    const transporter = this.getTransporter();

    const mailOptions = {
      from: EMAIL_FROM,
      to,
      subject,
      text: body,
      html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #6366f1;">${subject}</h2>
        <p>${body.replace(/\n/g, '<br>')}</p>
        <hr style="border: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="color: #9ca3af; font-size: 12px;">Sent by NodeWeave Workflow Engine</p>
      </div>`,
    };

    const info = await transporter.sendMail(mailOptions);
    return { messageId: info.messageId };
  }
}

module.exports = EmailService;
