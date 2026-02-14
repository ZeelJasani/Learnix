/**
 * Course Model / Course Model
 *
 * Aa model Learnix platform na courses store kare chhe MongoDB ma.
 * This model stores Learnix platform courses in MongoDB.
 *
 * Stripe Integration / Stripe Integration:
 * - Har course ne Stripe product ane price hoy chhe
 * - stripePriceId ane stripeProductId required chhe
 * - Every course has a Stripe product and price
 *
 * Content Structure / Content Structure:
 * Course -> Chapters -> Lessons
 * - Chapters virtual population thi load thay chhe
 *
 * Status Lifecycle / Status Lifecycle:
 * DRAFT -> PUBLISHED -> ARCHIVED
 */
import mongoose, { Schema, Document } from 'mongoose';

// Course difficulty levels / Course difficulty levels
export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

// Course publication status / Course publication status
export type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

/**
 * Course document interface
 * Aa interface MongoDB course document ni structure define kare chhe
 * This interface defines the MongoDB course document structure
 */
export interface ICourse extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;              // Course nu title / Course title
    description: string;        // Detailed description (HTML/Markdown)
    fileKey: string;            // S3 file key for course thumbnail/banner
    price: number;              // Course ni price (USD ma) / Course price (in USD)
    duration: number;           // Course duration (hours ma) / Course duration (in hours)
    level: CourseLevel;         // Difficulty level
    category: string;           // Course category (e.g., "Web Development")
    smallDescription: string;   // Short description for cards/listings
    slug: string;               // URL-friendly identifier
    status: CourseStatus;       // Publication status
    stripePriceId: string;      // Stripe price ID for checkout
    stripeProductId: string;    // Stripe product ID
    userId: mongoose.Types.ObjectId; // Course creator (mentor) nu ID
    createdAt: Date;
    updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
    {
        // Course title - 3 thi 100 characters
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 100,
        },
        // Detailed description - minimum 3 characters
        description: {
            type: String,
            required: true,
            minlength: 3,
        },
        // S3/R2 ma stored file ni key
        // Key of file stored in S3/R2
        fileKey: {
            type: String,
            required: true,
        },
        // Course ni price (minimum 0 = free course)
        // Course price (minimum 0 = free course)
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        // Course duration hours ma (1-500)
        // Course duration in hours (1-500)
        duration: {
            type: Number,
            required: true,
            min: 1,
            max: 500,
        },
        // Difficulty level
        level: {
            type: String,
            enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
            default: 'BEGINNER',
        },
        // Course category
        category: {
            type: String,
            required: true,
        },
        // Cards ane listings ma dikhava mate short description
        // Short description for display in cards and listings
        smallDescription: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 200,
        },
        // SEO-friendly URL slug
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        // Publication status
        status: {
            type: String,
            enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
            default: 'DRAFT',
        },
        // Stripe integration fields
        stripePriceId: {
            type: String,
            required: true,
            unique: true,
        },
        stripeProductId: {
            type: String,
            required: true,
        },
        // Course creator (mentor) - User model no reference
        // Course creator (mentor) - reference to User model
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// ===== Database Indexes / Database Indexes =====
// Query performance optimize karvaa mate indexes
// Indexes to optimize query performance
courseSchema.index({ status: 1 });       // Status thi filter karvaa mate
courseSchema.index({ category: 1 });     // Category thi filter karvaa mate
courseSchema.index({ userId: 1 });       // Creator na courses shodhvaa mate
courseSchema.index({ createdAt: -1 });   // Recent courses pehela

// ===== Virtual Population / Virtual Population =====
// Chapters virtual field thi load thay chhe (lazy loading)
// Chapters are loaded via virtual field (lazy loading)
courseSchema.virtual('chapters', {
    ref: 'Chapter',
    localField: '_id',
    foreignField: 'courseId',
});

// Virtuals ne JSON ane Object conversion ma include karo
// Include virtuals in JSON and Object conversions
courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

export const Course = mongoose.model<ICourse>('Course', courseSchema);
