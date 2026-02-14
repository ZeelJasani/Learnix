/**
 * Environment Variable Validation / Environment Variable Validation
 *
 * Aa file @t3-oss/env-nextjs no use kari ne environment variables validate kare chhe.
 * This file validates environment variables using @t3-oss/env-nextjs.
 *
 * Server-side ane client-side env vars alag alag define thay chhe
 * jema type-safety ane runtime validation banne provide thay chhe.
 * Server-side and client-side env vars are defined separately,
 * providing both type-safety and runtime validation.
 */
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Server-side environment variables - aa variables client-side par accessible nathi
   * Server-side environment variables - these are NOT accessible on the client-side
   */
  server: {
    // Database connection URL - Prisma mate jaruri chhe
    // Database connection URL - required for Prisma
    DATABASE_URL: z.string().url().optional(),

    // Application URL - full domain URL
    APP_URL: z.string().url().optional(),

    // Clerk authentication secret key - user authentication mate
    // Clerk authentication secret key - for user authentication
    CLERK_SECRET_KEY: z.string().min(1).optional(),

    // Clerk webhook secret - webhook signature verify karva mate
    // Clerk webhook secret - for verifying webhook signatures
    CLERK_WEBHOOK_SECRET: z.string().min(1).optional(),

    // Admin emails - comma-separated list of admin email addresses
    ADMIN_EMAILS: z.string().optional(),

    // Arcjet security key - rate limiting ane bot protection mate
    // Arcjet security key - for rate limiting and bot protection
    ARCJET_KEY: z.string().min(1).optional(),

    // AWS S3 credentials - file upload mate
    // AWS S3 credentials - for file uploads
    AWS_ACCESS_KEY_ID: z.string().min(1).optional(),
    AWS_SECRET_ACCESS_KEY: z.string().min(1).optional(),
    AWS_ENDPOINT_URL_S3: z.string().min(1).optional(),
    AWS_ENDPOINT_URL_IAM: z.string().min(1).optional(),
    AWS_REGION: z.string().min(1).optional(),

    // Stripe payment keys - course purchase mate
    // Stripe payment keys - for course purchases
    STRIPE_SECRET_KEY: z.string().min(1).optional(),
    STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),

    // Resend email API key - email notifications mate
    // Resend email API key - for email notifications
    RESEND_API_KEY: z.string().min(1).optional(),

    // Stream.io keys - live video sessions mate (server-side token generation)
    // Stream.io keys - for live video sessions (server-side token generation)
    STREAM_API_KEY: z.string().min(1).optional(),
    STREAM_API_SECRET: z.string().min(1).optional(),
  },

  /**
   * Client-side environment variables - aa NEXT_PUBLIC_ prefix sathe hoy chhe
   * Client-side environment variables - these must have NEXT_PUBLIC_ prefix
   */
  client: {
    // S3 bucket name - client-side image URLs banava mate
    // S3 bucket name - for constructing client-side image URLs
    NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES: z.string().min(1).optional(),

    // Clerk publishable key - client-side auth mate
    // Clerk publishable key - for client-side authentication
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1).optional(),

    // Backend API URL - client-side API calls mate
    // Backend API URL - for client-side API calls
    NEXT_PUBLIC_API_URL: z.string().min(1).optional(),

    // Stream.io API key - client-side video SDK mate
    // Stream.io API key - for client-side video SDK
    NEXT_PUBLIC_STREAM_API_KEY: z.string().min(1).optional(),
  },

  /**
   * Runtime env mapping - client-side variables ne process.env sathe map kare chhe
   * Runtime env mapping - maps client-side variables to process.env
   */
  experimental__runtimeEnv: {
    NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES: process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_STREAM_API_KEY: process.env.NEXT_PUBLIC_STREAM_API_KEY,
  },

  // Dev/test ma validation skip kare chhe jya env vars setup na hoy
  // Skips validation in dev/test where env vars may not be set up
  skipValidation: !!process.env.SKIP_ENV_VALIDATION || process.env.NODE_ENV === 'test',
});
