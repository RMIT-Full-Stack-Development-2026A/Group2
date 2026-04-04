const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 5;

const attempts = new Map();

function attemptKey(req, identifier) {
  const id = String(identifier ?? "")
    .trim()
    .toLowerCase();
  const ip = req.ip || req.socket?.remoteAddress || "unknown";
  return `${ip}::${id}`;
}

function pruneIfStale(key, now) {
  const entry = attempts.get(key);
  if (!entry) return null;
  if (now - entry.firstAt > WINDOW_MS) {
    attempts.delete(key);
    return null;
  }
  return entry;
}

function assertNotLocked(req, identifier) {
  const key = attemptKey(req, identifier);
  const now = Date.now();
  const entry = pruneIfStale(key, now);
  if (!entry) return;
  if (entry.count >= MAX_ATTEMPTS) {
    const err = new Error(
      "Too many failed sign-in attempts in the last 60 seconds. Wait for the window to reset, then try again. Example: wait 1 full minute, then sign in with your email like you@example.com.",
    );
    err.statusCode = 429;
    err.code = "LOGIN_RATE_LIMITED";
    throw err;
  }
}

function recordFailedLogin(req, identifier) {
  const key = attemptKey(req, identifier);
  const now = Date.now();
  let entry = pruneIfStale(key, now);
  if (!entry) {
    entry = { count: 0, firstAt: now };
    attempts.set(key, entry);
  }
  entry.count += 1;
}

function clearLoginAttempts(req, identifier) {
  attempts.delete(attemptKey(req, identifier));
}

module.exports = {
  assertNotLocked,
  recordFailedLogin,
  clearLoginAttempts,
  WINDOW_MS,
  MAX_ATTEMPTS,
};
