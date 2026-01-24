import { Request, Response, NextFunction } from 'express';
import { Webhook } from 'svix';
import Stripe from 'stripe';
import { UserService } from '../services/user.service';
import { EnrollmentService } from '../services/enrollment.service';
import { env } from '../config/env';
import { ApiResponse } from '../utils/apiResponse';
import { logger } from '../utils/logger';

// Initialize Stripe
const stripe = new Stripe(env.STRIPE_SECRET_KEY);

interface ClerkWebhookEvent {
    data: any;
    object: 'event';
    type: string;
}

export class WebhookController {
    /**
     * Handle Clerk webhook events
     */
    static async handleClerkWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const secret = env.CLERK_WEBHOOK_SECRET;

            if (!secret) {
                logger.error('CLERK_WEBHOOK_SECRET is not set');
                ApiResponse.error(res, 'Webhook secret not configured', 500);
                return;
            }

            const payload = req.body;
            const svixId = req.headers['svix-id'] as string;
            const svixTimestamp = req.headers['svix-timestamp'] as string;
            const svixSignature = req.headers['svix-signature'] as string;

            if (!svixId || !svixTimestamp || !svixSignature) {
                ApiResponse.error(res, 'Missing Svix headers', 400);
                return;
            }

            let event: ClerkWebhookEvent;

            try {
                const wh = new Webhook(secret);
                event = wh.verify(JSON.stringify(payload), {
                    'svix-id': svixId,
                    'svix-timestamp': svixTimestamp,
                    'svix-signature': svixSignature,
                }) as ClerkWebhookEvent;
            } catch (error) {
                logger.error('Clerk webhook signature verification failed:', error);
                ApiResponse.error(res, 'Invalid signature', 400);
                return;
            }

            // Handle user events
            if (event.type === 'user.created' || event.type === 'user.updated') {
                const userData = event.data;

                await UserService.syncFromClerkData({
                    id: userData.id,
                    emailAddresses: (userData.email_addresses || []).map((e: any) => ({
                        emailAddress: e.email_address,
                    })),
                    firstName: userData.first_name ?? null,
                    lastName: userData.last_name ?? null,
                    imageUrl: userData.image_url ?? '',
                });

                logger.info(`Processed Clerk webhook: ${event.type} for user ${userData.id}`);
            }

            ApiResponse.success(res, { received: true });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Handle Stripe webhook events
     */
    static async handleStripeWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const secret = env.STRIPE_WEBHOOK_SECRET;

            if (!secret) {
                logger.error('STRIPE_WEBHOOK_SECRET is not set');
                ApiResponse.error(res, 'Webhook secret not configured', 500);
                return;
            }

            const signature = req.headers['stripe-signature'] as string;

            if (!signature) {
                ApiResponse.error(res, 'Missing Stripe signature', 400);
                return;
            }

            let event: Stripe.Event;

            try {
                // Note: req.body should be raw buffer for Stripe verification
                event = stripe.webhooks.constructEvent(
                    req.body,
                    signature,
                    secret
                );
            } catch (error) {
                logger.error('Stripe webhook signature verification failed:', error);
                ApiResponse.error(res, 'Invalid signature', 400);
                return;
            }

            logger.info(`Received Stripe webhook: ${event.type}`);

            // Handle checkout session completed
            if (event.type === 'checkout.session.completed') {
                const session = event.data.object as Stripe.Checkout.Session;
                const courseId = session.metadata?.courseId;
                const enrollmentId = session.metadata?.enrollmentId;
                const customerId = session.customer as string;
                const amount = session.amount_total ? Number(session.amount_total) / 100 : 0;

                if (!courseId) {
                    logger.error('Course ID not found in session metadata');
                    ApiResponse.success(res, { received: true });
                    return;
                }

                // Find user by Stripe customer ID
                const user = await UserService.getByStripeCustomerId(customerId);

                if (!user) {
                    logger.error(`User not found for customer ID: ${customerId}`);
                    ApiResponse.success(res, { received: true });
                    return;
                }

                // Verify payment was successful
                if (session.payment_status !== 'paid') {
                    logger.info(`Payment not completed for session ${session.id}`);
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

                // Activate enrollment
                if (enrollmentId) {
                    const updated = await EnrollmentService.activate(
                        enrollmentId,
                        user._id.toString(),
                        courseId,
                        amount
                    );

                    if (updated) {
                        logger.info(`Activated enrollment ${enrollmentId}`);
                    } else {
                        // Create new enrollment if pending not found
                        await EnrollmentService.create({
                            userId: user._id.toString(),
                            courseId,
                            amount,
                            status: 'Active',
                        });
                        logger.info(`Created new active enrollment for user ${user._id}`);
                    }
                } else {
                    // Create new enrollment
                    await EnrollmentService.create({
                        userId: user._id.toString(),
                        courseId,
                        amount,
                        status: 'Active',
                    });
                    logger.info(`Created active enrollment for user ${user._id}`);
                }
            }

            // Handle session expiration
            if (event.type === 'checkout.session.expired') {
                const session = event.data.object as Stripe.Checkout.Session;
                const courseId = session.metadata?.courseId;
                const enrollmentId = session.metadata?.enrollmentId;
                const customerId = session.customer as string;

                if (enrollmentId && courseId) {
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

            ApiResponse.success(res, { received: true });
        } catch (error) {
            next(error);
        }
    }
}
