/**
 * Activity Model / Activity Model
 *
 * Aa model course mate learning activities store kare chhe.
 * This model stores learning activities for courses.
 *
 * Activity Types / Activity Types:
 * - ASSIGNMENT: Coding assignment ke written task
 * - QUIZ: Quiz (separate Quiz model sathe linked)
 * - PROJECT: Hands-on project
 * - READING: Reading material
 * - VIDEO: Video watching activity
 *
 * Scheduling / Scheduling:
 * - startDate: Activity kyare visible thay chhe
 * - dueDate: Activity ni deadline
 */
import mongoose, { Schema, Document } from 'mongoose';

// Activity types / Activity types
export type ActivityType = 'ASSIGNMENT' | 'QUIZ' | 'PROJECT' | 'READING' | 'VIDEO' | 'LIVE_SESSION';

/**
 * Activity document interface
 * Aa interface activity document ni structure define kare chhe
 * This interface defines the activity document structure
 */
export interface IActivity extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;                      // Activity title
    description: string | null;         // Activity description (optional)
    type: ActivityType;                 // Activity type
    startDate: Date | null;             // Start date (optional)
    dueDate: Date | null;               // Due date (optional)
    courseId: mongoose.Types.ObjectId;   // Associated course
    fileKeys: string[];                 // S3 file keys (PDFs, docs, videos)
    links: string[];                    // External links (blog URLs, etc.)
    content: string | null;             // Rich text content (project details, etc.)
    createdAt: Date;
    updatedAt: Date;
}

const activitySchema = new Schema<IActivity>(
    {
        // Activity title
        title: {
            type: String,
            required: true,
            trim: true,
        },
        // Activity description (optional)
        description: {
            type: String,
            default: null,
        },
        // Activity type - content nu prakar
        // Activity type - type of content
        type: {
            type: String,
            enum: ['ASSIGNMENT', 'QUIZ', 'PROJECT', 'READING', 'VIDEO', 'LIVE_SESSION'],
            default: 'ASSIGNMENT',
        },
        // Start date - kyare activity visible thay chhe
        // Start date - when activity becomes visible
        startDate: {
            type: Date,
            default: null,
        },
        // Due date - activity ni deadline
        // Due date - activity deadline
        dueDate: {
            type: Date,
            default: null,
        },
        // S3 file keys for uploaded files (PDFs, docs, videos)
        fileKeys: {
            type: [String],
            default: [],
        },
        // External links (blog URLs, etc.)
        links: {
            type: [String],
            default: [],
        },
        // Rich text content (project details, etc.)
        content: {
            type: String,
            default: null,
        },
        // Associated course nu reference
        // Reference to associated course
        courseId: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// Course activities deadline sathe sort karvaa mate
// For sorting course activities by deadline
activitySchema.index({ courseId: 1, dueDate: 1 });

// ===== Virtual Fields / Virtual Fields =====
// Activity completions virtual population
// Student completion records load kare chhe
// Loads student completion records
activitySchema.virtual('completions', {
    ref: 'ActivityCompletion',
    localField: '_id',
    foreignField: 'activityId',
});

activitySchema.set('toJSON', { virtuals: true });
activitySchema.set('toObject', { virtuals: true });

export const Activity = mongoose.model<IActivity>('Activity', activitySchema);
