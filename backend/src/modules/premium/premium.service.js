const Stripe = require("stripe");
const AppError = require("../../shared/errors/AppError");
const premiumRepository = require("./premium.repository");
const {
  PREMIUM_DURATION_MONTHS,
  PREMIUM_PLAN_NAME,
  PREMIUM_PRICE_USD,
} = require("./premium.interface");
const { sendSubscriptionPaymentSuccessEmail } = require("../../shared/utils/email");

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new AppError("Stripe is not configured.", {
      code: "STRIPE_NOT_CONFIGURED",
      statusCode: 500,
    });
  }
  return new Stripe(secretKey);
}

function addMonths(date, months) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

function toSubscriptionStatusDto(subscriptionDoc) {
  if (!subscriptionDoc) {
    return {
      isPremium: false,
      status: "free",
      expiryDate: null,
    };
  }

  return {
    isPremium: true,
    status: subscriptionDoc.status,
    expiryDate: subscriptionDoc.endDate,
  };
}

async function ensureNoActiveSubscription(userId) {
  const active = await premiumRepository.findActiveSubscription(userId);
  if (active) {
    throw new AppError("You already have an active premium subscription.", {
      code: "SUBSCRIPTION_ALREADY_ACTIVE",
      statusCode: 409,
    });
  }
}

async function grantPremiumSubscription(userId, provider) {
  const plan = await premiumRepository.findOrCreatePremiumPlan(
    PREMIUM_PLAN_NAME,
    PREMIUM_PRICE_USD,
    PREMIUM_DURATION_MONTHS,
  );

  const startDate = new Date();
  const endDate = addMonths(startDate, PREMIUM_DURATION_MONTHS);
  const subscription = await premiumRepository.upsertActiveSubscription(
    userId,
    plan._id,
    startDate,
    endDate,
  );

  return { subscription, plan, startDate, endDate, provider };
}

async function getPremiumStatus(userId) {
  const activeSubscription = await premiumRepository.findActiveSubscription(userId);
  return toSubscriptionStatusDto(activeSubscription);
}

async function notifyPaymentEmailSafely(userId, provider, endDate) {
  try {
    const user = await premiumRepository.findUserById(userId);
    await sendSubscriptionPaymentSuccessEmail({
      toEmail: user?.email,
      provider,
      endDate,
    });
  } catch (error) {
    console.error(`Failed to send premium ${provider} payment email:`, error.message);
  }
}

async function payWithWallet() {
  throw new AppError("Wallet payment is disabled. Please use Stripe checkout.", {
    code: "WALLET_PAYMENT_DISABLED",
    statusCode: 400,
  });
}

async function createCheckoutSession(userId) {
  await ensureNoActiveSubscription(userId);
  return createStripeCheckoutSession(userId, false);
}

async function createTestCheckoutSession(userId) {
  return createStripeCheckoutSession(userId, true);
}

async function createStripeCheckoutSession(userId, isTestPayment) {
  const stripe = getStripeClient();

  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: PREMIUM_PLAN_NAME },
          unit_amount: 1000,
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId: String(userId),
      isTestPayment: isTestPayment ? "true" : "false",
    },
    success_url: `${clientUrl}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${clientUrl}/premium/cancel`,
  });

  return {
    id: session.id,
    url: session.url,
  };
}

async function confirmCheckoutSession(userId, sessionId) {
  if (!sessionId) {
    throw new AppError("Missing Stripe checkout session id.", {
      code: "MISSING_SESSION_ID",
      statusCode: 400,
    });
  }

  const stripe = getStripeClient();
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session?.metadata?.userId !== String(userId)) {
    throw new AppError("Session user mismatch.", {
      code: "INVALID_SESSION_USER",
      statusCode: 403,
    });
  }

  if (session?.payment_status !== "paid") {
    throw new AppError("Stripe payment is not completed yet.", {
      code: "PAYMENT_NOT_COMPLETED",
      statusCode: 400,
    });
  }

  await handleStripeCheckoutCompleted(session);
  return getPremiumStatus(userId);
}

async function handleStripeCheckoutCompleted(session) {
  const userId = session?.metadata?.userId;
  const isTestPayment = session?.metadata?.isTestPayment === "true";
  if (!userId) {
    return;
  }

  const existing = await premiumRepository.findActiveSubscription(userId);
  if (existing && !isTestPayment) {
    return;
  }
  let granted;
  let provider = "stripe";

  if (existing && isTestPayment) {
    const plan = await premiumRepository.findOrCreatePremiumPlan(
      PREMIUM_PLAN_NAME,
      PREMIUM_PRICE_USD,
      PREMIUM_DURATION_MONTHS,
    );
    const startDate = existing.endDate > new Date() ? existing.endDate : new Date();
    const endDate = addMonths(startDate, PREMIUM_DURATION_MONTHS);
    const subscription = await premiumRepository.upsertActiveSubscription(
      userId,
      plan._id,
      startDate,
      endDate,
    );
    granted = { subscription, endDate };
    provider = "stripe-test";
  } else {
    granted = await grantPremiumSubscription(userId, "stripe");
  }

  await premiumRepository.createTransaction({
    userID: userId,
    walletID: null,
    userSubscriptionID: granted.subscription._id,
    amount: PREMIUM_PRICE_USD,
    currency: "USD",
    provider,
    status: "success",
  });

  notifyPaymentEmailSafely(userId, provider, granted.endDate);
}

async function sendTestPaymentEmail(userId) {
  const subscription = await getPremiumStatus(userId);
  const fallbackEndDate = addMonths(new Date(), PREMIUM_DURATION_MONTHS);
  const endDate = subscription?.expiryDate || fallbackEndDate;
  await notifyPaymentEmailSafely(userId, "stripe-test", endDate);
}

module.exports = {
  getPremiumStatus,
  payWithWallet,
  createCheckoutSession,
  createTestCheckoutSession,
  confirmCheckoutSession,
  sendTestPaymentEmail,
  getStripeClient,
  handleStripeCheckoutCompleted,
};
