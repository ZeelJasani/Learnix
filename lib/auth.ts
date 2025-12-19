import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { env } from "./env";
import { emailOTP } from "better-auth/plugins";
import { resend } from "./resend";
import { admin } from "better-auth/plugins";
// import { verify } from "crypto";

const isProd = process.env.NODE_ENV === 'production';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  socialProviders: {
    github: {
      clientId: env.AUTH_GITHUB_CLIENT_ID,
      clientSecret: env.AUTH_GITHUB_SECRET,
    },
  },
  plugins: [
  emailOTP({
    async sendVerificationOTP({ email, otp }) {
      await resend.emails.send({
        from: "MasterjiLMS <onboarding@resend.dev>",
        to: [email],
        subject: "Masterji - Verify your email",
        html: `<p>Your OTP is <strong>${otp}</strong></p>`,
      });
    },
  }),
  admin(),
],
  url: isProd
    ? 'https://mastrji.vercel.app' // your production URL
    : 'http://localhost:3000',     // your local URL
});