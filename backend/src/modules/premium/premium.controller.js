const AppError = require("../../shared/errors/AppError");
const { sendError } = require("../../shared/utils/httpResponse");
const premiumService = require("./premium.service");
const { validateCreateCheckoutSessionBody } = require("./premium.validation");

function handleControllerError(res, err) {
  if (err instanceof AppError) {
    return sendError(
      res,
      err.statusCode,
      err.code,
      err.message,
      err.errors,
    );
  }

  return sendError(
    res,
    500,
    "INTERNAL_ERROR",
    err?.message || "Something went wrong. Please try again later.",
  );
}

async function getMe(req, res) {
  try {
    const subscription = await premiumService.getPremiumStatus(String(req.user.id));
    return res.status(200).json({ status: "success", subscription });
  } catch (err) {
    return handleControllerError(res, err);
  }
}

async function createCheckoutSession(req, res) {
  const errors = validateCreateCheckoutSessionBody(req.body);
  if (errors.length) {
    return sendError(res, 400, "VALIDATION_ERROR", "Validation failed.", errors);
  }

  try {
    const session = await premiumService.createCheckoutSession(String(req.user.id));
    return res.status(200).json({ status: "success", session });
  } catch (err) {
    return handleControllerError(res, err);
  }
}

async function createTestCheckoutSession(req, res) {
  const errors = validateCreateCheckoutSessionBody(req.body);
  if (errors.length) {
    return sendError(res, 400, "VALIDATION_ERROR", "Validation failed.", errors);
  }

  try {
    const session = await premiumService.createTestCheckoutSession(String(req.user.id));
    return res.status(200).json({ status: "success", session });
  } catch (err) {
    return handleControllerError(res, err);
  }
}

async function confirmCheckoutSession(req, res) {
  try {
    const sessionId = req.body?.sessionId;
    const subscription = await premiumService.confirmCheckoutSession(
      String(req.user.id),
      sessionId,
    );
    return res.status(200).json({ status: "success", subscription });
  } catch (err) {
    return handleControllerError(res, err);
  }
}

async function resetPremium(req, res) {
  try {
    const result = await premiumService.resetPremiumStatus(String(req.user.id));
    return res.status(200).json({
      status: "success",
      message: "Premium status has been reset.",
      ...result,
    });
  } catch (err) {
    return handleControllerError(res, err);
  }
}

async function sendTestEmail(req, res) {
  try {
    await premiumService.sendTestPaymentEmail(String(req.user.id));
    return res.status(200).json({
      status: "success",
      message: "Test payment email has been sent.",
    });
  } catch (err) {
    return handleControllerError(res, err);
  }
}

async function stripeWebhook(req, res) {
  const signature = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return sendError(
      res,
      400,
      "INVALID_WEBHOOK_CONFIG",
      "Stripe webhook signature or secret is missing.",
    );
  }

  try {
    const stripe = premiumService.getStripeClient();
    const event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);

    if (event.type === "checkout.session.completed") {
      await premiumService.handleStripeCheckoutCompleted(event.data.object);
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    return sendError(res, 400, "WEBHOOK_VERIFICATION_FAILED", err.message);
  }
}

module.exports = {
  getMe,
  createCheckoutSession,
  createTestCheckoutSession,
  confirmCheckoutSession,
  sendTestEmail,
  resetPremium,
  stripeWebhook,
};
