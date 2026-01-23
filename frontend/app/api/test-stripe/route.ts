import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET() {
    try {
        // Test Stripe connection by listing prices
        const prices = await stripe.prices.list({ limit: 1 });
        return NextResponse.json({ 
            success: true, 
            hasPrices: prices.data.length > 0,
            firstPrice: prices.data[0]?.id || 'No prices found'
        });
    } catch (error: any) {
        console.error('Stripe test failed:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: error.message,
                code: error.code,
                type: error.type,
                raw: error.raw
            },
            { status: 500 }
        );
    }
}
