const PREMIUM_FEATURES = [
  "Match replay with full move history",
  "Advanced statistics",
  "Premium profile badge",
];

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatProviderLabel(provider) {
  if (provider === "stripe-test") return "Stripe (Test)";
  if (provider === "stripe") return "Stripe";
  return String(provider ?? "Stripe");
}

function formatValidUntil(endDate) {
  return new Date(endDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatAmount(amountUsd) {
  return `$${Number(amountUsd).toFixed(2)} USD`;
}

function buildPremiumPaymentSuccessText({
  recipientName,
  planName,
  amountUsd,
  provider,
  validUntil,
}) {
  const featureLines = PREMIUM_FEATURES.map((feature) => `  • ${feature}`).join("\n");

  return [
    `Welcome to Premium, ${recipientName}!`,
    "",
    "Your TicTacToang Premium subscription has been successfully activated.",
    "",
    "Subscription details",
    `Plan: ${planName}`,
    `Amount charged: ${formatAmount(amountUsd)}`,
    `Payment method: ${formatProviderLabel(provider)}`,
    `Valid until: ${validUntil}`,
    "",
    "You now have access to:",
    featureLines,
    "",
    "Thank you for supporting TicTacToang!",
    "If you have questions, reply to this email or contact our support team.",
  ].join("\n");
}

function buildPremiumPaymentSuccessHtml({
  recipientName,
  planName,
  amountUsd,
  provider,
  validUntil,
}) {
  const safeName = escapeHtml(recipientName);
  const safePlan = escapeHtml(planName);
  const safeAmount = escapeHtml(formatAmount(amountUsd));
  const safeProvider = escapeHtml(formatProviderLabel(provider));
  const safeValidUntil = escapeHtml(validUntil);

  const featureItems = PREMIUM_FEATURES.map(
    (feature) =>
      `<li style="margin:0 0 8px;font-size:15px;line-height:1.5;color:#374151;">${escapeHtml(feature)}</li>`,
  ).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Premium Subscription Activated</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f0ff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f3f0ff;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(91,33,182,0.08);">
          <tr>
            <td style="padding:32px 32px 12px;text-align:center;">
              <p style="margin:0 0 8px;font-size:13px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:#7c3aed;">TicTacToang</p>
              <h1 style="margin:0;font-size:28px;line-height:1.25;font-weight:700;color:#5b21b6;">Welcome to Premium, ${safeName}!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 20px;text-align:center;">
              <p style="margin:0;font-size:16px;line-height:1.6;color:#4b5563;">
                Your TicTacToang Premium subscription has been successfully activated.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f5f3ff;border:1px solid #e9d5ff;border-radius:12px;">
                <tr>
                  <td style="padding:20px 22px;">
                    <p style="margin:0 0 14px;font-size:14px;font-weight:700;color:#6d28d9;">Subscription details</p>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding:6px 0;font-size:14px;color:#6b7280;width:42%;">Plan</td>
                        <td style="padding:6px 0;font-size:14px;font-weight:600;color:#111827;">${safePlan}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:14px;color:#6b7280;">Amount charged</td>
                        <td style="padding:6px 0;font-size:14px;font-weight:600;color:#111827;">${safeAmount}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:14px;color:#6b7280;">Payment method</td>
                        <td style="padding:6px 0;font-size:14px;font-weight:600;color:#111827;">${safeProvider}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:14px;color:#6b7280;">Valid until</td>
                        <td style="padding:6px 0;font-size:14px;font-weight:600;color:#111827;">${safeValidUntil}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 24px;">
              <p style="margin:0 0 12px;font-size:15px;font-weight:700;color:#111827;">You now have access to:</p>
              <ul style="margin:0;padding:0 0 0 20px;">${featureItems}</ul>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 32px;text-align:center;">
              <p style="margin:0;font-size:13px;line-height:1.6;color:#9ca3af;">
                Thank you for supporting TicTacToang!<br />
                If you have questions, reply to this email or contact our support team.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

module.exports = {
  PREMIUM_FEATURES,
  buildPremiumPaymentSuccessHtml,
  buildPremiumPaymentSuccessText,
  formatValidUntil,
};
