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

// Lazy-loaded Stripe client - build time par instantiate nahi thay jyare env var present na hoy
// Lazy-loaded Stripe client - not instantiated at build time when env var may not be present
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    _stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      typescript: true,
    });
  }
  return _stripe;
}

// Backward-compatible named export using a Proxy so existing `stripe.xyz` call sites work unchanged.
// This avoids touching every call site while still deferring initialization to request time.
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return getStripe()[prop as keyof Stripe];
  },
});