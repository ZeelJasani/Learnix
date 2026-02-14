// ============================================================================
// Learnix LMS - Webhook Controller (વેબહૂક કંટ્રોલર)
// ============================================================================
// Aa controller external service webhooks handle kare chhe.
// This controller handles external service webhooks.
//
// જવાબદારીઓ / Responsibilities:
// - Clerk webhook processing (Clerk વેબહૂક processing)
//   - User created/updated events (યુઝર create/update events)
// - Stripe webhook processing (Stripe વેબહૂક processing)
//   - Checkout session completed (ચેકઆઉટ session completed)
//   - Checkout session expired (ચેકઆઉટ session expired)
//
// 🔒 Security: Webhook signatures verified before processing
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { Webhook } from 'svix';
import { env } from '../config/env';
import { UserService } from '../services/user.service';
import { EnrollmentService } from '../services/enrollment.service';
import { ApiResponse } from '../utils/apiResponse';
import { logger } from '../utils/logger';

// ============================================================================
// Clerk Webhook Types (Clerk વેબહૂક Types)
// ============================================================================

/**
 * Clerk email object type / Clerk email object no type
 *
 * Clerk webhook payload mathi email ma aave chhe.
 * This type comes from the email object in Clerk webhook payload.
 */
interface ClerkEmailAddress {
    email_address: string;
    id: string;
}

/**
 * Clerk webhook event data type / Clerk event data no type
 *
 * User create/update event data represent kare chhe.
 * Represents user create/update event data.
 */
interface ClerkUserEventData {
    id: string;
    email_addresses: ClerkEmailAddress[];
    first_name: string | null;
    last_name: string | null;
    image_url: string;
}

/**
 * Clerk webhook event type / Clerk event no full type
 *
 * Event type ane data sathe complete webhook payload.
 * Complete webhook payload with event type and data.
 */
interface ClerkWebhookEvent {
    type: string;
    data: ClerkUserEventData;
}

/**
 * WebhookController - વેબહૂક સંબંધિત API endpoints
 * WebhookController - Webhook-related API endpoints
 *
 * External services (Clerk, Stripe) na webhooks securely process kare chhe.
 * Securely processes webhooks from external services (Clerk, Stripe).
 */
export class WebhookController {
    /**
     * Clerk webhook handle karo / Handle Clerk webhook
     *
     * Svix library thi signature verify karine user create/update kare chhe.
     * Verifies signature using Svix library then creates/updates user.
     *
     * Supported events:
     * - user.created: Navo user create karo / Create new user
     * - user.updated: Existing user update karo / Update existing user
     *
     * @route POST /api/webhooks/clerk
     */
    static async handleClerkWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // ============================================================
            // Step 1: Webhook signature verify karo / Verify webhook signature
            // ============================================================
            const WEBHOOK_SECRET = env.CLERK_WEBHOOK_SECRET;

            if (!WEBHOOK_SECRET) {
                logger.error('CLERK_WEBHOOK_SECRET is not configured');
                ApiResponse.error(res, 'Webhook secret not configured', 500);
                return;
            }

            // Svix verification headers kadho / Extract Svix verification headers
            const svix_id = req.headers['svix-id'] as string;
            const svix_timestamp = req.headers['svix-timestamp'] as string;
            const svix_signature = req.headers['svix-signature'] as string;

            // Required headers check karo / Check required headers
            if (!svix_id || !svix_timestamp || !svix_signature) {
                logger.error('Missing Svix headers in Clerk webhook');
                ApiResponse.error(res, 'Missing webhook headers', 400);
                return;
            }

            // Webhook instance create karo ane verify karo / Create webhook instance and verify
            const wh = new Webhook(WEBHOOK_SECRET);
            let evt: ClerkWebhookEvent;

            try {
                // Raw body thi signature verify karo / Verify signature with raw body
                evt = wh.verify(req.body, {
                    'svix-id': svix_id,
                    'svix-timestamp': svix_timestamp,
                    'svix-signature': svix_signature,
                }) as ClerkWebhookEvent;
            } catch (err) {
                logger.error('Clerk webhook verification failed:', err);
                ApiResponse.error(res, 'Webhook verification failed', 400);
                return;
            }

            // ============================================================
            // Step 2: Event type mutajb process karo / Process based on event type
            // ============================================================
            const eventType = evt.type;
            logger.info(`Clerk webhook received: ${eventType}`);

            // User create ke update event handle karo / Handle user create or update event
            if (eventType === 'user.created' || eventType === 'user.updated') {
                const userData = evt.data;

                // Clerk data ne app-compatible format ma convert karo / Convert Clerk data to app-compatible format
                const user = await UserService.syncFromClerkData({
                    id: userData.id,
                    emailAddresses: userData.email_addresses.map(e => ({
                        emailAddress: e.email_address,
                    })),
                    firstName: userData.first_name,
                    lastName: userData.last_name,
                    imageUrl: userData.image_url,
                });

                logger.info(`User ${eventType === 'user.created' ? 'created' : 'updated'}: ${user.email}`);
            }

            // Success response moklo / Send success response
            ApiResponse.success(res, { received: true });
        } catch (error) {
            logger.error('Error processing Clerk webhook:', error);
            next(error);
        }
    }

    /**
     * Stripe webhook handle karo / Handle Stripe webhook
     *
     * Stripe SDK thi signature verify karine checkout events process kare chhe.
     * Verifies signature using Stripe SDK then processes checkout events.
     *
     * Supported events:
     * - checkout.session.completed: Enrollment activate karo / Activate enrollment
     * - checkout.session.expired: Pending enrollment clean up karo / Clean up pending enrollment
     *
     * @route POST /api/webhooks/stripe
     */
    static async handleStripeWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // ============================================================
            // Step 1: Stripe webhook signature verify karo / Verify Stripe webhook signature
            // ============================================================
            const stripe = new Stripe(env.STRIPE_SECRET_KEY);
            const sig = req.headers['stripe-signature'];

            // Stripe webhook secret configured chhe ke nahi check karo
            // Check if Stripe webhook secret is configured
            if (!env.STRIPE_WEBHOOK_SECRET) {
                logger.error('STRIPE_WEBHOOK_SECRET is not configured');
                ApiResponse.error(res, 'Webhook secret not configured', 500);
                return;
            }

            if (!sig) {
                logger.error('Missing Stripe signature header');
                ApiResponse.error(res, 'Missing stripe signature', 400);
                return;
            }

            let event: Stripe.Event;

            try {
                // Stripe signature verify karo / Verify Stripe signature
                event = stripe.webhooks.constructEvent(
                    req.body,
                    sig,
                    env.STRIPE_WEBHOOK_SECRET
                );
            } catch (err) {
                logger.error('Stripe webhook verification failed:', err);
                ApiResponse.error(res, 'Webhook verification failed', 400);
                return;
            }

            logger.info(`Stripe webhook received: ${event.type}`);

            // ============================================================
            // Step 2: Checkout session completed handle karo
            // Step 2: Handle checkout session completed
            // ============================================================
            if (event.type === 'checkout.session.completed') {
                const session = event.data.object as Stripe.Checkout.Session;
                // Session metadata mathi course ane enrollment details kadho
                // Extract course and enrollment details from session metadata
                const courseId = session.metadata?.courseId;
                const enrollmentId = session.metadata?.enrollmentId;
                const customerId = session.customer as string;
                // Amount cents mathi rupees ma convert karo / Convert amount from cents to currency
                const amount = session.amount_total ? Number(session.amount_total) / 100 : 0;

                // Course ID validate karo / Validate course ID
                if (!courseId) {
                    logger.error('Course ID not found in session metadata');
                    ApiResponse.success(res, { received: true });
                    return;
                }

                // Stripe customer ID thi user shodhо / Find user by Stripe customer ID
                const user = await UserService.getByStripeCustomerId(customerId);

                if (!user) {
                    logger.error(`User not found for customer ID: ${customerId}`);
                    ApiResponse.success(res, { received: true });
                    return;
                }

                // Payment status verify karo / Verify payment status
                if (session.payment_status !== 'paid') {
                    logger.info(`Payment not completed for session ${session.id}`);
                    // Pending enrollment clean up karo / Clean up pending enrollment
                    if (enrollmentId) {
                        await EnrollmentService.deletePending(
                            enrollmentId,
                            user._id.toString(),
                            courseId
                        );
                    }
                    ApiResponse.success(res, { received: true });
                    return;
                }

                // ============================================================
                // Enrollment activate karo / Activate enrollment
                // ============================================================
                if (enrollmentId) {
                    // Pending enrollment shodhine activate karo / Find pending enrollment and activate
                    const updated = await EnrollmentService.activate(
                        enrollmentId,
                        user._id.toString(),
                        courseId,
                        amount
                    );

                    if (updated) {
                        logger.info(`Activated enrollment ${enrollmentId}`);
                    } else {
                        // Pending enrollment na male to navu create karo / Create new if pending not found
                        await EnrollmentService.create({
                            userId: user._id.toString(),
                            courseId,
                            amount,
                            status: 'Active',
                        });
                        logger.info(`Created new active enrollment for user ${user._id}`);
                    }
                } else {
                    // Navu enrollment create karo / Create new enrollment
                    await EnrollmentService.create({
                        userId: user._id.toString(),
                        courseId,
                        amount,
                        status: 'Active',
                    });
                    logger.info(`Created active enrollment for user ${user._id}`);
                }
            }

            // ============================================================
            // Step 3: Checkout session expired handle karo
            // Step 3: Handle checkout session expired
            // ============================================================
            if (event.type === 'checkout.session.expired') {
                const session = event.data.object as Stripe.Checkout.Session;
                const enrollmentId = session.metadata?.enrollmentId;
                const courseId = session.metadata?.courseId;
                const customerId = session.customer as string;

                // Pending enrollment clean up karo / Clean up pending enrollment
                if (enrollmentId && customerId && courseId) {
                    const user = await UserService.getByStripeCustomerId(customerId);
                    if (user) {
                        await EnrollmentService.deletePending(
                            enrollmentId,
                            user._id.toString(),
                            courseId
                        );
                        logger.info(`Cleaned up expired enrollment ${enrollmentId}`);
                    }
                }
            }

            // Stripe ne success response moklo / Send success response to Stripe
            ApiResponse.success(res, { received: true });
        } catch (error) {
            logger.error('Error processing Stripe webhook:', error);
            next(error);
        }
    }
}
