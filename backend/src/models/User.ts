/**
 * User Model / User Model
 *
 * Aa model Learnix platform na users store kare chhe MongoDB ma.
 * This model stores Learnix platform users in MongoDB.
 *
 * Clerk Integration / Clerk Integration:
 * - clerkId field Clerk authentication sathe link kare chhe
 * - User create thay chhe jyare Clerk webhook fire thay ke peheli login thay
 *
 * Roles / Roles:
 * - admin: Platform administrator
 * - mentor: Course instructor/creator
 * - user: Student/learner
 *
 * Banning / Banning:
 * - banned flag user ne block kare chhe
 * - banReason ane banExpires optional chhe
 */
import mongoose, { Schema, Document } from 'mongoose';

/**
 * User document interface
 * Aa interface MongoDB document ni structure define kare chhe
 * This interface defines the MongoDB document structure
 */
export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    clerkId: string;            // Clerk authentication ID
    name: string;               // User nu display name / User's display name
    email: string;              // User no email (unique, lowercase)
    emailVerified: boolean;     // Email verify thayo chhe ke nahi / Whether email is verified
    image: string | null;       // Profile image URL
    role: string | null;        // User role: admin, mentor, user
    stripeCustomerId: string | null; // Stripe customer ID for payments
    banned: boolean;            // User banned chhe ke nahi / Whether user is banned
    banReason: string | null;   // Ban nu karan / Reason for ban
    banExpires: Date | null;    // Ban expire thavano time / When ban expires
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        // Clerk authentication ID - unique identifier for Clerk
        clerkId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        // User nu naam / User's name
        name: {
            type: String,
            required: true,
        },
        // Email - unique ane lowercase store thay chhe
        // Email - stored as unique and lowercase
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        // Email verification status
        emailVerified: {
            type: Boolean,
            default: false,
        },
        // Profile image URL (Clerk thi sync thay chhe)
        // Profile image URL (synced from Clerk)
        image: {
            type: String,
            default: null,
        },
        // User role - access control mate vaparay chhe
        // User role - used for access control
        role: {
            type: String,
            enum: ['admin', 'mentor', 'user'],
            default: 'user',
        },
        // Stripe customer ID - payment integration mate
        // Stripe customer ID - for payment integration
        stripeCustomerId: {
            type: String,
            unique: true,
            sparse: true,   // Null values ne unique constraint mathi exclude kare chhe
        },
        // Ban system fields
        banned: {
            type: Boolean,
            default: false,
        },
        banReason: {
            type: String,
            default: null,
        },
        banExpires: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,   // createdAt ane updatedAt auto-manage thay chhe
    }
);

// Created date par descending index - recent users pehela aave
// Descending index on created date - recent users come first
userSchema.index({ createdAt: -1 });

export const User = mongoose.model<IUser>('User', userSchema);
