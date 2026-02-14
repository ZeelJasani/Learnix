/**
 * Activity Completion Model / Activity Completion Model
 *
 * Aa model student nu activity completion status track kare chhe.
 * This model tracks student activity completion status.
 *
 * Ek student ek activity ek j var complete kari shake chhe
 * (unique compound index: userId + activityId).
 * A student can only complete an activity once
 * (unique compound index: userId + activityId).
 *
 * Note: timestamps: false chhe karanke completedAt field manually manage thay chhe.
 * Note: timestamps: false because completedAt field is managed manually.
 */
import mongoose, { Schema, Document } from 'mongoose';

/**
 * ActivityCompletion document interface
 * Aa interface activity completion document ni structure define kare chhe
 * This interface defines the activity completion document structure
 */
export interface IActivityCompletion extends Document {
    _id: mongoose.Types.ObjectId;
    activityId: mongoose.Types.ObjectId;  // Activity nu ID / Activity's ID
    userId: mongoose.Types.ObjectId;      // Student nu ID / Student's ID
    completedAt: Date;                    // Completion timestamp
}

const activityCompletionSchema = new Schema<IActivityCompletion>(
    {
        // Activity nu reference
        // Reference to activity
        activityId: {
            type: Schema.Types.ObjectId,
            ref: 'Activity',
            required: true,
        },
        // Student nu reference
        // Reference to student
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        // Completion timestamp - auto-set thay chhe Date.now sathe
        // Completion timestamp - auto-set with Date.now
        completedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        // completedAt field manually manage thay chhe etle timestamps off chhe
        // timestamps off because completedAt field is managed manually
        timestamps: false,
    }
);

// Duplicate completion prevent karvaa mate compound unique index
// Compound unique index to prevent duplicate completions
activityCompletionSchema.index({ userId: 1, activityId: 1 }, { unique: true });

// Activity na completions shodhvaa mate
// For finding activity's completions
activityCompletionSchema.index({ activityId: 1 });

export const ActivityCompletion = mongoose.model<IActivityCompletion>('ActivityCompletion', activityCompletionSchema);
