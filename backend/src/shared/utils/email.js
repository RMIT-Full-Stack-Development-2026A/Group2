const nodemailer = require("nodemailer");

let transporter;
let hasWarnedMissingConfig = false;
let hasWarnedMissingRecipient = false;

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;
  if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS) {
    if (!hasWarnedMissingConfig) {
      console.warn(
        "Email is not configured. Set EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM to enable payment emails.",
      );
      hasWarnedMissingConfig = true;
    }
    return null;
  }

  transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT),
    secure: Number(EMAIL_PORT) === 465,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  return transporter;
}

async function sendSubscriptionPaymentSuccessEmail({ toEmail, provider, endDate }) {
  const mailer = getTransporter();
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;

  if (!toEmail) {
    if (!hasWarnedMissingRecipient) {
      console.warn("Payment email skipped: recipient email is missing on user profile.");
      hasWarnedMissingRecipient = true;
    }
    return;
  }

  if (!mailer || !from) {
    return;
  }

  await mailer.sendMail({
    from,
    to: toEmail,
    subject: "Premium subscription payment successful",
    text: `Your premium subscription payment via ${provider} was successful. Your subscription is active until ${new Date(endDate).toISOString()}.`,
  });
}

module.exports = {
  sendSubscriptionPaymentSuccessEmail,
};
