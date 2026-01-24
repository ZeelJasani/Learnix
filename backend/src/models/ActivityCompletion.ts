import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityCompletion extends Document {
    _id: mongoose.Types.ObjectId;
    activityId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    completedAt: Date;
}

const activityCompletionSchema = new Schema<IActivityCompletion>(
    {
        activityId: {
            type: Schema.Types.ObjectId,
            ref: 'Activity',
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        completedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: false, // Using completedAt instead
    }
);

// Compound unique index to prevent duplicate completions
activityCompletionSchema.index({ userId: 1, activityId: 1 }, { unique: true });
activityCompletionSchema.index({ activityId: 1 });

export const ActivityCompletion = mongoose.model<IActivityCompletion>('ActivityCompletion', activityCompletionSchema);
