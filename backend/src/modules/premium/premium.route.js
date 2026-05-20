const express = require("express");
const authenticate = require("../../middleware/authenticate");
const premiumController = require("./premium.controller");

const router = express.Router();

router.use(authenticate);
router.get("/me", premiumController.getMe);
router.post("/create-checkout-session", premiumController.createCheckoutSession);
router.post("/create-test-checkout-session", premiumController.createTestCheckoutSession);
router.post("/confirm-session", premiumController.confirmCheckoutSession);
router.post("/test-email", premiumController.sendTestEmail);
router.post("/reset", premiumController.resetPremium);

module.exports = router;
