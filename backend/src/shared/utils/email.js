const nodemailer = require("nodemailer");
const {
  buildPremiumPaymentSuccessHtml,
  buildPremiumPaymentSuccessText,
  formatValidUntil,
} = require("./premiumEmail.template");

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

async function sendSubscriptionPaymentSuccessEmail({
  toEmail,
  recipientName,
  planName,
  amountUsd,
  provider,
  endDate,
}) {
  const mailer = getTransporter();
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;
  const appUrl = (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/+$/, "");
  const validUntil = formatValidUntil(endDate);

  const templatePayload = {
    recipientName: recipientName || "Player",
    planName: planName || "Monthly Premium",
    amountUsd: amountUsd ?? 10,
    provider,
    validUntil,
    appUrl,
  };

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
    subject: "Premium Subscription Activated — TicTacToang",
    text: buildPremiumPaymentSuccessText(templatePayload),
    html: buildPremiumPaymentSuccessHtml(templatePayload),
  });
}

module.exports = {
  sendSubscriptionPaymentSuccessEmail,
};
