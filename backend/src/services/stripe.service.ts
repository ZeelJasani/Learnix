
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { ApiError } from '../utils/apiError';

dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not defined');
}

export class StripeService {
    private static stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2024-06-20',
    });

    /**
     * Create a new product in Stripe
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
            console.error('Stripe createProduct error:', error);
            throw new ApiError(500, 'Failed to create Stripe product');
        }
    }

    /**
     * Create a price for a product
     * @param productId Stripe Product ID
     * @param amount Amount in smallest currency unit (e.g., paise for INR)
     */
    static async createPrice(productId: string, amount: number): Promise<Stripe.Price> {
        try {
            return await this.stripe.prices.create({
                product: productId,
                unit_amount: Math.round(amount), // Ensure integer
                currency: 'inr',
            });
        } catch (error) {
            console.error('Stripe createPrice error:', error);
            throw new ApiError(500, 'Failed to create Stripe price');
        }
    }

    /**
     * Update a product in Stripe
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
            console.error('Stripe updateProduct error:', error);
            throw new ApiError(500, 'Failed to update Stripe product');
        }
    }
}
