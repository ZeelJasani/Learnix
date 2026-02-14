/**
 * Environment Variables Configuration / Environment Variables Configuration
 *
 * Aa file Zod schema thi badhi environment variables validate kare chhe.
 * This file validates all environment variables using a Zod schema.
 *
 * Startup par jaruri variables missing hoy to process exit thay chhe
 * je production ma invalid config sathe server start thata aatke chhe.
 * If required variables are missing at startup, the process exits,
 * preventing the server from starting with invalid config in production.
 */
import { z } from 'zod';
import dotenv from 'dotenv';

// .env file mathi environment variables load karo
// Load environment variables from .env file
dotenv.config();

/**
 * Environment variables nu Zod validation schema
 * Zod validation schema for environment variables
 *
 * Required variables missing hoy to server start nahi thay.
 * Server won't start if required variables are missing.
 */
const envSchema = z.object({
    // ===== Server Configuration / Server Configuration =====
    // Application environment: development, production, ke test
    // Application environment: development, production, or test
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

    // Server port number, default 5000
    PORT: z.string().default('5000').transform(Number),

    // ===== MongoDB Database / MongoDB Database =====
    // MongoDB connection string - required chhe database connect karvaa mate
    // MongoDB connection string - required for database connection
    MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),

    // ===== Clerk Authentication / Clerk Authentication =====
    // Clerk ni secret key - server-side authentication mate
    // Clerk secret key - for server-side authentication
    CLERK_SECRET_KEY: z.string().min(1, 'CLERK_SECRET_KEY is required'),

    // Clerk ni publishable key - client verification mate
    // Clerk publishable key - for client verification
    CLERK_PUBLISHABLE_KEY: z.string().min(1, 'CLERK_PUBLISHABLE_KEY is required'),

    // Clerk webhook secret - webhook signature verify karvaa mate (optional)
    // Clerk webhook secret - for verifying webhook signatures (optional)
    CLERK_WEBHOOK_SECRET: z.string().optional(),

    // ===== Stripe Payments / Stripe Payments =====
    // Stripe ni secret key - payment processing mate
    // Stripe secret key - for payment processing
    STRIPE_SECRET_KEY: z.string().min(1, 'STRIPE_SECRET_KEY is required'),

    // Stripe webhook secret - payment webhook verify karvaa mate (optional)
    // Stripe webhook secret - for verifying payment webhooks (optional)
    STRIPE_WEBHOOK_SECRET: z.string().optional(),

    // ===== Stream.io Video / Stream.io Video =====
    // Stream API key ane secret - live sessions mate
    // Stream API key and secret - for live sessions
    STREAM_API_KEY: z.string().min(1, 'STREAM_API_KEY is required'),
    STREAM_API_SECRET: z.string().min(1, 'STREAM_API_SECRET is required'),

    // ===== AWS S3 / Cloudflare R2 Storage =====
    // File upload mate S3-compatible storage credentials
    // S3-compatible storage credentials for file uploads
    AWS_ACCESS_KEY_ID: z.string().min(1, 'AWS_ACCESS_KEY_ID is required'),
    AWS_SECRET_ACCESS_KEY: z.string().min(1, 'AWS_SECRET_ACCESS_KEY is required'),
    AWS_REGION: z.string().default('auto'),

    // Custom S3 endpoint (Cloudflare R2 mate use thay chhe)
    // Custom S3 endpoint (used for Cloudflare R2)
    AWS_ENDPOINT_URL_S3: z.string().optional(),

    // Bucket name jyaa files store thay chhe
    // Bucket name where files are stored
    S3_BUCKET_NAME: z.string().min(1, 'S3_BUCKET_NAME is required'),

    // ===== Admin Configuration / Admin Configuration =====
    // Comma-separated admin email addresses
    ADMIN_EMAILS: z.string().optional().default(''),

    // ===== Frontend URL / Frontend URL =====
    // CORS ane redirect mate frontend nu URL
    // Frontend URL for CORS and redirects
    FRONTEND_URL: z.string().default('http://localhost:3000'),
});

// Environment variables parse karo ane validate karo
// Parse and validate environment variables
const parsed = envSchema.safeParse(process.env);

// Validation fail thay to error batavio ane process band karo
// Show error and exit process if validation fails
if (!parsed.success) {
    console.error('❌ Invalid environment variables:');
    console.error(parsed.error.flatten().fieldErrors);
    process.exit(1);
}

// Validated environment variables export karo
// Export validated environment variables
export const env = parsed.data;

// Type export karo je bija files ma use thay shake
// Export type for use in other files
export type Env = z.infer<typeof envSchema>;
