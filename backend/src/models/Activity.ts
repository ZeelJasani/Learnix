import mongoose, { Schema, Document } from 'mongoose';

export type ActivityType = 'ASSIGNMENT' | 'QUIZ' | 'PROJECT' | 'READING' | 'VIDEO';

export interface IActivity extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string | null;
    type: ActivityType;
    startDate: Date | null;
    dueDate: Date | null;
    courseId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const activitySchema = new Schema<IActivity>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: null,
        },
        type: {
            type: String,
            enum: ['ASSIGNMENT', 'QUIZ', 'PROJECT', 'READING', 'VIDEO'],
            default: 'ASSIGNMENT',
        },
        startDate: {
            type: Date,
            default: null,
        },
        dueDate: {
            type: Date,
            default: null,
        },
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

// Indexes
activitySchema.index({ courseId: 1, dueDate: 1 });

// Virtual for completions
activitySchema.virtual('completions', {
    ref: 'ActivityCompletion',
    localField: '_id',
    foreignField: 'activityId',
});

activitySchema.set('toJSON', { virtuals: true });
activitySchema.set('toObject', { virtuals: true });

export const Activity = mongoose.model<IActivity>('Activity', activitySchema);
