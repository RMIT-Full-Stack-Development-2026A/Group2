const nodemailer = require("nodemailer");

let transporter;
let hasWarnedMissingConfig = false;
let hasWarnedMissingRecipient = false;

function getMissingEmailConfigKeys() {
  const requiredKeys = ["EMAIL_HOST", "EMAIL_PORT", "EMAIL_USER", "EMAIL_PASS"];
  return requiredKeys.filter((key) => !process.env[key]);
}

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;
  const missingKeys = getMissingEmailConfigKeys();
  if (missingKeys.length) {
    if (!hasWarnedMissingConfig) {
      console.warn(
        `Email is not configured. Missing: ${missingKeys.join(", ")}. Set EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM to enable payment emails.`,
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
  provider,
  endDate,
  throwOnSkip = false,
}) {
  const mailer = getTransporter();
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;

  if (!toEmail) {
    if (!hasWarnedMissingRecipient) {
      console.warn("Payment email skipped: recipient email is missing on user profile.");
      hasWarnedMissingRecipient = true;
    }
    if (throwOnSkip) {
      throw new Error("Recipient email is missing on the user profile.");
    }
    return;
  }

  if (!mailer || !from) {
    if (throwOnSkip) {
      const missingKeys = getMissingEmailConfigKeys();
      throw new Error(
        missingKeys.length
          ? `Email is not configured. Missing: ${missingKeys.join(", ")}.`
          : "Email sender is not configured. Set EMAIL_FROM or EMAIL_USER.",
      );
    }
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
  getMissingEmailConfigKeys,
  sendSubscriptionPaymentSuccessEmail,
};
