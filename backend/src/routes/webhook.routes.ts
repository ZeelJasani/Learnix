import { Router, raw } from 'express';
import { WebhookController } from '../controllers/webhook.controller';

const router = Router();

// Clerk webhook - uses JSON body
router.post('/clerk', WebhookController.handleClerkWebhook);

// Stripe webhook - needs raw body for signature verification
router.post('/stripe', raw({ type: 'application/json' }), WebhookController.handleStripeWebhook);

export default router;
