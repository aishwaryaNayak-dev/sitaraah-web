const nodemailer = require('nodemailer');

const transporter = process.env.SMTP_USER
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
  : null;

const sendMail = async (to, subject, text) => {
  if (!transporter) return;
  try {
    await transporter.sendMail({ from: `Sitaraah Wellness <${process.env.SMTP_USER}>`, to, subject, text });
  } catch (err) {
    console.error('Email failed:', err.message);
  }
};

module.exports = sendMail;
