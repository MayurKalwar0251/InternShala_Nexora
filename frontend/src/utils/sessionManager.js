/**
 * Session Manager
 * Generates and manages unique session IDs for guest users
 */

const SESSION_KEY = "vibe_commerce_session_id";

/**
 * Generate a unique session ID
 */
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
};

/**
 * Get or create session ID
 */
export const getSessionId = () => {
  let sessionId = localStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(SESSION_KEY, sessionId);
    console.log("🆕 New session created:", sessionId);
  } else {
    console.log("✅ Existing session found:", sessionId);
  }

  return sessionId;
};

/**
 * Clear session (useful for testing)
 */
export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
  console.log("🗑️ Session cleared");
};

/**
 * Check if session exists
 */
export const hasSession = () => {
  return !!localStorage.getItem(SESSION_KEY);
};
