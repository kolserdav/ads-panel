import nodemailer from 'nodemailer';

const { SMTP_EMAIL, SMTP_PASS, SMTP_HOST, SMTP_PORT }: any = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: parseInt(SMTP_PORT),
  secure: false,
  requireTLS: true,
  auth: {
    user: SMTP_EMAIL,
    pass: SMTP_PASS,
  },
});

export default transporter;
