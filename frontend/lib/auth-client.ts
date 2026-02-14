// ============================================================================
// Learnix LMS - Auth Client Stub (ઓથ ક્લાયન્ટ સ્ટબ)
// ============================================================================
// Aa file Better Auth ni legacy compatibility mate stub client provide kare chhe.
// This file provides a stub client for Better Auth legacy compatibility.
//
// ⚠️ Better Auth removed chhe - Clerk use thay chhe
// ⚠️ Better Auth has been removed - Clerk is used instead
//
// Aa stub ensure kare chhe ke old imports break na thay ane clear
// error messages aave ke kya migrate karvu joiye.
// This stub ensures old imports don't break and provides clear
// error messages about where to migrate.
// ============================================================================

export const authClient = {
  // Session hook stub - Clerk na useUser/useAuth use karo
  // Session hook stub - use Clerk's useUser/useAuth instead
  useSession: () => {
    throw new Error("Better Auth has been removed. Use authentication hooks/components instead.");
  },
  // Sign out stub - Clerk no useClerk().signOut() use karo
  // Sign out stub - use Clerk's useClerk().signOut() instead
  signOut: async () => {
    throw new Error("Better Auth has been removed. Use authentication hooks/components instead.");
  },
  signIn: {
    // Social sign-in stub - Clerk ni built-in social auth use karo
    // Social sign-in stub - use Clerk's built-in social auth instead
    social: async () => {
      throw new Error("Better Auth has been removed. Use authentication hooks/components instead.");
    },
    // Email OTP stub - Clerk ni email verification use karo
    // Email OTP stub - use Clerk's email verification instead
    emailOtp: async () => {
      throw new Error("Better Auth has been removed. Use authentication hooks/components instead.");
    },
  },
  emailOtp: {
    // OTP send stub - Clerk ni verification use karo
    // OTP send stub - use Clerk's verification instead
    sendVerificationOtp: async () => {
      throw new Error("Better Auth has been removed. Use authentication hooks/components instead.");
    },
  },
};