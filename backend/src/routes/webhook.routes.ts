// ============================================================================
// Learnix LMS - Webhook Routes (વેબહૂક રાઉટ્સ)
// ============================================================================
// Aa file external webhook API routes define kare chhe.
// This file defines external webhook API routes.
//
// Base path: /api/webhooks
//
// રાઉટ્સ / Routes:
// POST /clerk  - Clerk user events handle karo (JSON body)
// POST /stripe - Stripe checkout events handle karo (raw body)
//
// ⚠️ Aa routes authentication nathi vaaprti - webhooks external services thi aave chhe
// ⚠️ These routes don't use authentication - webhooks come from external services
//
// 🔒 Stripe route raw body parser vaapre chhe signature verification mate
// 🔒 Stripe route uses raw body parser for signature verification
// ============================================================================

import { Router, raw } from 'express';
import { WebhookController } from '../controllers/webhook.controller';

const router = Router();

// Clerk webhook - JSON body parse thay chhe / Clerk webhook - JSON body is parsed
router.post('/clerk', WebhookController.handleClerkWebhook);

// Stripe webhook - raw body jaruri chhe signature verification mate
// Stripe webhook - raw body needed for signature verification
router.post('/stripe', raw({ type: 'application/json' }), WebhookController.handleStripeWebhook);

export default router;
