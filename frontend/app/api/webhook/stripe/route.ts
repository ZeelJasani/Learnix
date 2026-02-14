// Aa file Stripe webhook handler chhe jo payment events verify kari ne backend ne forward kare chhe
// This file handles Stripe webhooks by verifying signatures and forwarding events to the backend
import { env } from "@/lib/env";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function to log errors consistently
const logError = (message: string, error?: any) => {
    console.error(`[Stripe Webhook Error] ${message}`, error || '');
};

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
        // Forward the webhook event to the backend
        const backendResponse = await fetch(`${API_BASE_URL}/webhooks/stripe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'stripe-signature': signature,
            },
            body: body,
        });

        const result = await backendResponse.json();

        console.log(`[Stripe Webhook] Backend response:`, result);

        return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        logError('Error forwarding webhook to backend', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}