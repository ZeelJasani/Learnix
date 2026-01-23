// // import { createAuthClient } from "better-auth/react"
// // import { emailOTPClient } from "better-auth/plugins";

// // export const authClient = createAuthClient({plugins: [emailOTPClient()]});







export const authClient = {
  useSession: () => {
    throw new Error("Better Auth has been removed. Use authentication hooks/components instead.");
  },
  signOut: async () => {
    throw new Error("Better Auth has been removed. Use authentication hooks/components instead.");
  },
  signIn: {
    social: async () => {
      throw new Error("Better Auth has been removed. Use authentication hooks/components instead.");
    },
    emailOtp: async () => {
      throw new Error("Better Auth has been removed. Use authentication hooks/components instead.");
    },
  },
  emailOtp: {
    sendVerificationOtp: async () => {
      throw new Error("Better Auth has been removed. Use authentication hooks/components instead.");
    },
  },
};