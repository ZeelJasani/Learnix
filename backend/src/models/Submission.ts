import mongoose, { Schema, Document } from 'mongoose';

export enum SubmissionStatus {
    SUBMITTED = 'submitted',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

export interface ISubmission extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    lessonId: mongoose.Types.ObjectId;
    content: string;
    status: SubmissionStatus;
    createdAt: Date;
    updatedAt: Date;
}

const submissionSchema = new Schema<ISubmission>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        lessonId: {
            type: Schema.Types.ObjectId,
            ref: 'Lesson',
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['submitted', 'approved', 'rejected'],
            default: 'submitted',
        } as any,
    },
    {
        timestamps: true,
    }
);

// Indexes
submissionSchema.index({ userId: 1, lessonId: 1 }, { unique: true }); // One submission per lesson per user
submissionSchema.index({ lessonId: 1, status: 1 }); // For finding submissions to review

export const Submission = mongoose.model<ISubmission>('Submission', submissionSchema);
