import { config } from '@/config';

const sendEmail = async (to: string, subject: string, text: string): Promise<void> => {
  const nodemailer = require('nodemailer');

  const transporter = nodemailer.createTransport({
    host: config.EMAIL_SERVICE_HOST,
    port: config.EMAIL_SERVICE_PORT,
    auth: {
      user: config.EMAIL_SERVICE_USER,
      pass: config.EMAIL_SERVICE_PASSWORD
    }
  });

  const mailOptions = {
    from: `"Notification Service" <${config.EMAIL_SERVICE_USER}>`,
    to,
    subject,
    text
  };

  return transporter.sendMail(mailOptions);
};

export { sendEmail };
