/**
 * Stripe Service / Stripe Service
 *
 * Aa service Stripe payment gateway sathe integrate kare chhe.
 * This service integrates with the Stripe payment gateway.
 *
 * Functionality / Functionality:
 * - Stripe product create/update (course mate)
 * - Stripe price create (course pricing mate)
 * - INR currency default chhe
 *
 * Security / Security:
 * - STRIPE_SECRET_KEY na vagar server start nahi thay
 * - Server won't start without STRIPE_SECRET_KEY
 */
import Stripe from 'stripe';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';
import { env } from '../config/env';

// Stripe secret key validate karo - aa na hoy to server start nahi thay
// Validate Stripe secret key - server won't start without it
if (!env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not defined');
}

export class StripeService {
    // Stripe client instance - singleton pattern
    private static stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
        apiVersion: '2024-06-20',
    });

    /**
     * Stripe ma navo product create karo (course mate)
     * Create a new product in Stripe (for a course)
     */
    static async createProduct(name: string, description: string, image?: string): Promise<Stripe.Product> {
        try {
            return await this.stripe.products.create({
                name,
                description,
                images: image ? [image] : [],
                metadata: {
                    source: 'Learnix LMS',
                },
            });
        } catch (error) {
            logger.error('Stripe createProduct error:', error);
            throw new ApiError(500, 'Failed to create Stripe product');
        }
    }

    /**
     * Product mate price create karo (smallest currency unit ma, e.g., paise for INR)
     * Create a price for a product (in smallest currency unit, e.g., paise for INR)
     * @param productId Stripe Product ID
     * @param amount Amount in smallest currency unit
     */
    static async createPrice(productId: string, amount: number): Promise<Stripe.Price> {
        try {
            return await this.stripe.prices.create({
                product: productId,
                unit_amount: Math.round(amount), // Ensure integer
                currency: 'inr',
            });
        } catch (error) {
            logger.error('Stripe createPrice error:', error);
            throw new ApiError(500, 'Failed to create Stripe price');
        }
    }

    /**
     * Stripe product update karo (name, description, image, default price)
     * Update a Stripe product (name, description, image, default price)
     */
    static async updateProduct(productId: string, data: { name?: string; description?: string; image?: string, default_price?: string }): Promise<Stripe.Product> {
        try {
            return await this.stripe.products.update(productId, {
                name: data.name,
                description: data.description,
                ...(data.image && { images: [data.image] }),
                ...(data.default_price && { default_price: data.default_price }),
            });
        } catch (error) {
            logger.error('Stripe updateProduct error:', error);
            throw new ApiError(500, 'Failed to update Stripe product');
        }
    }
}
