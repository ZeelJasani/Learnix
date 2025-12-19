import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import error from "next/error";

// Helper function to log errors consistently
const logError = (message: string, error?: any) => {
    console.error(`[Stripe Webhook Error] ${message}`, error || '');
};

// Helper function to clean up failed payment enrollments
async function cleanupFailedEnrollment(enrollmentId: string, userId: string, courseId: string) {
    try {
        await prisma.enrollment.deleteMany({
            where: {
                id: enrollmentId,
                userId: userId,
                courseId: courseId,
                status: 'Pending'
            }
        });
        console.log(`[Stripe Webhook] Cleaned up pending enrollment ${enrollmentId} for failed payment`);
    } catch (error) {
        console.error(`[Stripe Webhook] Error cleaning up failed enrollment ${enrollmentId}:`, error);
    }
}

// Helper function to create a new enrollment
async function createEnrollment(userId: string, courseId: string, amount: number) {
    return await prisma.enrollment.create({
        data: {
            userId,
            courseId,
            amount,
            status: 'Active',
        },
    });
}

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            env.STRIPE_WEBHOOK_SECRET
        );
        console.log(`[Stripe Webhook] Received event: ${event.type}`);
    } catch (error) {
        logError('Invalid signature', error);
        return new Response(JSON.stringify({ error: 'Webhook signature verification failed' }), { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const session = event.data.object as Stripe.Checkout.Session;
        const courseId = session.metadata?.courseId;
        const customerId = session.customer as string;
        const enrollmentId = session.metadata?.enrollmentId;
        const amount = session.amount_total ? Number(session.amount_total) / 100 : 0;

        if (!courseId) {
            throw new Error("Course ID not found in session metadata");
        }

        // Find user by stripeCustomerId
        const user = await prisma.user.findUnique({
            where: { stripeCustomerId: customerId },
        });

        if (!user) {
            throw new Error(`User not found for customer ID: ${customerId}`);
        }

        // Handle different event types
        if (event.type === "checkout.session.completed") {
            // Verify the payment was successful
            if (session.payment_status !== 'paid') {
                console.log(`[Stripe Webhook] Payment not completed for session ${session.id}, status: ${session.payment_status}`);
                if (enrollmentId) {
                    await cleanupFailedEnrollment(enrollmentId, user.id, courseId);
                }
                return new Response(JSON.stringify({ received: true, message: 'Payment not completed' }), { 
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            // Check if enrollment already exists and is active
            const existingEnrollment = await prisma.enrollment.findFirst({
                where: {
                    userId: user.id,
                    courseId: courseId,
                    status: 'Active',
                },
            });

            if (existingEnrollment) {
                console.log(`[Stripe Webhook] User ${user.id} is already enrolled in course ${courseId}`);
                return new Response(JSON.stringify({ message: 'User already enrolled' }), { 
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            // If we have an enrollmentId, try to update the existing enrollment
            if (enrollmentId) {
                try {
                    const updatedEnrollment = await prisma.enrollment.updateMany({
                        where: {
                            id: enrollmentId,
                            userId: user.id,
                            courseId: courseId,
                            status: 'Pending',
                        },
                        data: {
                            status: "Active",
                            amount: amount,
                            updatedAt: new Date(),
                        },
                    });

                    if (updatedEnrollment.count > 0) {
                        console.log(`[Stripe Webhook] Successfully updated enrollment ${enrollmentId} to Active`);
                        return new Response(JSON.stringify({ received: true }), { 
                            status: 200,
                            headers: { 'Content-Type': 'application/json' }
                        });
                    }
                    console.log(`[Stripe Webhook] Pending enrollment ${enrollmentId} not found or already processed`);
                } catch (updateError) {
                    console.error(`[Stripe Webhook] Error updating enrollment ${enrollmentId}:`, updateError);
                    // Continue to create a new enrollment if update fails
                }
            }

            // Create a new enrollment record if update wasn't possible or failed
            try {
                await createEnrollment(user.id, courseId, amount);
                console.log(`[Stripe Webhook] Created new active enrollment for user ${user.id} in course ${courseId}`);
                return new Response(JSON.stringify({ received: true }), { 
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch (createError) {
                console.error(`[Stripe Webhook] Error creating new enrollment:`, createError);
                throw new Error('Failed to create enrollment record');
            }
        } 
        // Handle session expiration
        else if (event.type === 'checkout.session.expired') {
            console.log(`[Stripe Webhook] Session expired for enrollment ${enrollmentId}`);
            if (enrollmentId) {
                await cleanupFailedEnrollment(enrollmentId, user.id, courseId);
            }
            return new Response(JSON.stringify({ received: true }), { 
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // For any other event type, just acknowledge receipt
        return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        logError('Error processing webhook', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}