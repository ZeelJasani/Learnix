// ============================================================================
// Learnix LMS - Stripe Client (Stripe ક્લાયન્ટ)
// ============================================================================
// Aa file server-side Stripe SDK instance create kare chhe.
// This file creates the server-side Stripe SDK instance.
//
// Payment processing mate validated env variables use thay chhe.
// Uses validated env variables for payment processing.
//
// ⚠️ Server-only: Aa module faqat server-side code ma use thay chhe
// ⚠️ Server-only: This module is only used in server-side code
// ============================================================================

import "server-only";

import Stripe from "stripe";
import { env } from "./env";

// Stripe client instance TypeScript mode sathe
// Stripe client instance with TypeScript mode enabled
export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  typescript: true,
});