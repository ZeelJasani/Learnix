import { clerkClient } from '@clerk/clerk-sdk-node';
import { User, IUser } from '../models/User';
import { env } from '../config/env';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';

interface ClerkUserData {
    id: string;
    emailAddresses: Array<{ emailAddress: string }>;
    firstName: string | null;
    lastName: string | null;
    imageUrl: string;
}

export class UserService {
    /**
     * Get or create a user from Clerk data
     */
    static async getOrCreateFromClerk(clerkId: string): Promise<IUser> {
        try {
            // Check if user exists in database
            const existingUser = await User.findOne({ clerkId });

            if (existingUser) {
                return existingUser;
            }

            // Fetch user data from Clerk
            const clerkUser = await clerkClient.users.getUser(clerkId);

            if (!clerkUser) {
                throw ApiError.notFound('Clerk user not found');
            }

            // Create user in database
            const newUser = await this.syncFromClerkData({
                id: clerkUser.id,
                emailAddresses: clerkUser.emailAddresses.map(e => ({ emailAddress: e.emailAddress })),
                firstName: clerkUser.firstName,
                lastName: clerkUser.lastName,
                imageUrl: clerkUser.imageUrl,
            });

            return newUser;
        } catch (error) {
            logger.error('Error in getOrCreateFromClerk:', error);
            throw error;
        }
    }

    /**
     * Sync user data from Clerk webhook or API
     */
    static async syncFromClerkData(clerkData: ClerkUserData): Promise<IUser> {
        const email = clerkData.emailAddresses?.[0]?.emailAddress;

        if (!email) {
            throw ApiError.badRequest('Clerk user has no email address');
        }

        const adminEmails = (env.ADMIN_EMAILS || '')
            .split(',')
            .map(e => e.trim().toLowerCase())
            .filter(Boolean);
        const shouldBeAdmin = adminEmails.includes(email.toLowerCase());

        const name = [clerkData.firstName, clerkData.lastName]
            .filter(Boolean)
            .join(' ') || email.split('@')[0];

        // Try to find existing user by clerkId or email
        let user = await User.findOne({ clerkId: clerkData.id });

        if (user) {
            // Update existing user
            user.name = name;
            user.email = email;
            user.image = clerkData.imageUrl;
            user.emailVerified = true;
            // Only update role if user should be admin (don't downgrade mentor to user)
            if (shouldBeAdmin && user.role !== 'admin') {
                user.role = 'admin';
            }
            // Don't change role if it's already set (preserve mentor, admin, etc.)
            await user.save();
            return user;
        }

        // Check if user exists by email
        user = await User.findOne({ email: email.toLowerCase() });

        if (user) {
            // Link existing user to Clerk
            user.clerkId = clerkData.id;
            user.name = name;
            user.image = clerkData.imageUrl;
            user.emailVerified = true;
            // Only update role if user should be admin (don't downgrade mentor to user)
            if (shouldBeAdmin && user.role !== 'admin') {
                user.role = 'admin';
            }
            // Don't change role if it's already set (preserve mentor, admin, etc.)
            await user.save();
            return user;
        }

        // Create new user
        user = new User({
            clerkId: clerkData.id,
            name,
            email: email.toLowerCase(),
            emailVerified: true,
            image: clerkData.imageUrl,
            role: shouldBeAdmin ? 'admin' : 'user',
        });

        await user.save();
        return user;
    }

    /**
     * Get user by ID
     */
    static async getById(id: string): Promise<IUser | null> {
        return User.findById(id);
    }

    /**
     * Get user by Clerk ID
     */
    static async getByClerkId(clerkId: string): Promise<IUser | null> {
        return User.findOne({ clerkId });
    }

    /**
     * Get all users (admin)
     */
    static async getAll(options: { page?: number; limit?: number } = {}): Promise<{
        users: IUser[];
        total: number;
    }> {
        const page = options.page || 1;
        const limit = options.limit || 20;
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            User.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            User.countDocuments(),
        ]);

        return { users: users as unknown as IUser[], total };
    }

    /**
     * Update user's Stripe customer ID
     */
    static async updateStripeCustomerId(userId: string, stripeCustomerId: string): Promise<IUser | null> {
        return User.findByIdAndUpdate(
            userId,
            { stripeCustomerId },
            { new: true }
        );
    }

    /**
     * Get user by Stripe customer ID
     */
    static async getByStripeCustomerId(stripeCustomerId: string): Promise<IUser | null> {
        return User.findOne({ stripeCustomerId });
    }

    /**
     * Ban a user
     */
    static async banUser(userId: string, reason: string, expires?: Date): Promise<IUser | null> {
        return User.findByIdAndUpdate(
            userId,
            {
                banned: true,
                banReason: reason,
                banExpires: expires || null,
            },
            { new: true }
        );
    }

    /**
     * Unban a user
     */
    static async unbanUser(userId: string): Promise<IUser | null> {
        return User.findByIdAndUpdate(
            userId,
            {
                banned: false,
                banReason: null,
                banExpires: null,
            },
            { new: true }
        );
    }
}
