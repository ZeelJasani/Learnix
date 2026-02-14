/**
 * User Service / User Service
 *
 * Aa service user management ane Clerk authentication integration handle kare chhe.
 * This service handles user management and Clerk authentication integration.
 *
 * Clerk Integration / Clerk Integration:
 * - Clerk webhook thi user data sync thay chhe
 * - ADMIN_EMAILS env var ma hoy to auto-admin assign thay chhe
 * - Email-based user matching for existing accounts
 *
 * Methods / Methods:
 * - getOrCreateFromClerk: Clerk ID thi user shodhvo ke create karvo
 * - syncFromClerkData: Clerk webhook data thi user sync karvo
 * - getById/getByClerkId: User lookup methods
 * - getAll: Paginated user list (admin)
 * - banUser/unbanUser: User moderation
 */
import { clerkClient } from '@clerk/clerk-sdk-node';
import { User, IUser } from '../models/User';
import { env } from '../config/env';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';
import { LiveSessionService } from './live-session.service';

interface ClerkUserData {
    id: string;
    emailAddresses: Array<{ emailAddress: string }>;
    firstName: string | null;
    lastName: string | null;
    imageUrl: string;
}

export class UserService {
    /**
     * Clerk ID thi user shodhvo ke navo create karvo
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
     * Clerk webhook ke API thi user data sync karvo
     * Sync user data from Clerk webhook or API
     *
     * Admin auto-detection: ADMIN_EMAILS env var ma email hoy to admin role assign thay chhe
     * Admin auto-detection: assigns admin role if email is in ADMIN_EMAILS env var
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

            // Sync user to Stream.io / Sync user to Stream.io
            await LiveSessionService.syncUser({
                id: user.clerkId,
                name: user.name,
                email: user.email,
                image: user.image || undefined,
                role: user.role || undefined
            });

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

            // Sync user to Stream.io / Sync user to Stream.io
            await LiveSessionService.syncUser({
                id: user.clerkId,
                name: user.name,
                email: user.email,
                image: user.image || undefined,
                role: user.role || undefined
            });

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

        // Sync user to Stream.io / Sync user to Stream.io
        await LiveSessionService.syncUser({
            id: user.clerkId,
            name: user.name,
            email: user.email,
            image: user.image || undefined,
            role: user.role || undefined
        });

        return user;
    }

    /**
     * ID thi user shodhvo / Get user by ID
     */
    static async getById(id: string): Promise<IUser | null> {
        return User.findById(id);
    }

    /**
     * Clerk ID thi user shodhvo / Get user by Clerk ID
     */
    static async getByClerkId(clerkId: string): Promise<IUser | null> {
        return User.findOne({ clerkId });
    }

    /**
     * Badha users ni paginated list (admin only)
     * Get all users with pagination (admin only)
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
     * User nu Stripe customer ID update karvo / Update user's Stripe customer ID
     */
    static async updateStripeCustomerId(userId: string, stripeCustomerId: string): Promise<IUser | null> {
        return User.findByIdAndUpdate(
            userId,
            { stripeCustomerId },
            { new: true }
        );
    }

    /**
     * Stripe customer ID thi user shodhvo / Get user by Stripe customer ID
     */
    static async getByStripeCustomerId(stripeCustomerId: string): Promise<IUser | null> {
        return User.findOne({ stripeCustomerId });
    }

    /**
     * User ne ban karvo (reason ane optional expiry sathe)
     * Ban a user (with reason and optional expiry)
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
     * User ne unban karvo / Unban a user
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
