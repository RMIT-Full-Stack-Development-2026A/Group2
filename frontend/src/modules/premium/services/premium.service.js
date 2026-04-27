import { API_ENDPOINTS, apiRequest } from "../../../config/api.config";

export async function getPremiumMe() {
  const data = await apiRequest(API_ENDPOINTS.premium.me, { method: "GET" });
  return data?.subscription ?? null;
}

export async function createPremiumCheckoutSession() {
  const data = await apiRequest(API_ENDPOINTS.premium.createCheckoutSession, {
    method: "POST",
    body: JSON.stringify({}),
  });
  return data?.session ?? null;
}

export async function createPremiumTestCheckoutSession() {
  const data = await apiRequest(API_ENDPOINTS.premium.createTestCheckoutSession, {
    method: "POST",
    body: JSON.stringify({}),
  });
  return data?.session ?? null;
}

export async function confirmPremiumCheckoutSession(sessionId) {
  const data = await apiRequest(API_ENDPOINTS.premium.confirmSession, {
    method: "POST",
    body: JSON.stringify({ sessionId }),
  });
  return data?.subscription ?? null;
}

export async function sendPremiumTestEmail() {
  const data = await apiRequest(API_ENDPOINTS.premium.testEmail, {
    method: "POST",
    body: JSON.stringify({}),
  });
  return data?.message || "Test email request sent.";
}
