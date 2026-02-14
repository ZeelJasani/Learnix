// ============================================================================
// Learnix LMS - Auth Server Stub (ઓથ સર્વર સ્ટબ)
// ============================================================================
// Aa file Better Auth server-side ni legacy compatibility mate stub provide kare chhe.
// This file provides a stub for Better Auth server-side legacy compatibility.
//
// ⚠️ Better Auth removed chhe - Clerk use thay chhe
// ⚠️ Better Auth has been removed - Clerk is used instead
// ============================================================================

// Legacy auth server stub - Clerk na server helpers use karo
// Legacy auth server stub - use Clerk's server helpers instead
export const auth = {
  api: {
    getSession: async () => {
      throw new Error("Better Auth has been removed. Use server authentication helpers instead.");
    },
  },
};