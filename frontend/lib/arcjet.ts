// ============================================================================
// Learnix LMS - Arcjet Security Configuration (Arcjet સિક્યુરિટી)
// ============================================================================
// Aa file Arcjet security middleware configure kare chhe.
// This file configures the Arcjet security middleware.
//
// Features / વિશેષતાઓ:
// - Bot detection (detectBot)
// - Rate limiting (fixedWindow, slidingWindow)
// - Signup protection (protectSignup)
// - Sensitive info filtering (sensitiveInfo)
// - Shield protection (shield)
//
// Development ma DRY_RUN mode use thay chhe - production ma LIVE mode
// Uses DRY_RUN mode in development - LIVE mode in production
//
// ⚠️ Server-only: Aa module faqat server-side code ma use thay chhe
// ⚠️ Server-only: This module is only used in server-side code
// ============================================================================

import "server-only";

import arcjet, {
    detectBot,
    fixedWindow,
    protectSignup,
    sensitiveInfo,
    shield,
    slidingWindow,
} from "@arcjet/next"
import { env } from "./env";

// Arcjet protection utilities re-export karo / Re-export Arcjet protection utilities
export {
    detectBot,
    fixedWindow,
    protectSignup,
    sensitiveInfo,
    shield,
    slidingWindow
};

// Development mode check karo / Check if in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// Arcjet instance create karo default shield protection sathe
// Create Arcjet instance with default shield protection
export default arcjet({
    key: env.ARCJET_KEY,
    // Fingerprint thi request identify karo / Identify requests by fingerprint
    characteristics: ["fingerprint"],
    rules: [
        // Shield protection - development ma DRY_RUN, production ma LIVE
        // Shield protection - DRY_RUN in development, LIVE in production
        shield({
            mode: isDevelopment ? "DRY_RUN" : "LIVE",
        }),
    ],
});