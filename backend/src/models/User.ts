import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    clerkId: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    role: string | null;
    stripeCustomerId: string | null;
    banned: boolean;
    banReason: string | null;
    banExpires: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        clerkId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        emailVerified: {
            type: Boolean,
            default: false,
        },
        image: {
            type: String,
            default: null,
        },
        role: {
            type: String,
            enum: ['admin', 'instructor', 'user'],
            default: 'user',
        },
        stripeCustomerId: {
            type: String,
            unique: true,
            sparse: true,
        },
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
        timestamps: true,
    }
);

// Indexes
userSchema.index({ createdAt: -1 });

export const User = mongoose.model<IUser>('User', userSchema);
