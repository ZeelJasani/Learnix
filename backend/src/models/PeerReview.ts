import mongoose, { Schema, Document } from 'mongoose';

export interface IPeerReview extends Document {
    _id: mongoose.Types.ObjectId;
    submissionId: mongoose.Types.ObjectId;
    reviewerId: mongoose.Types.ObjectId;
    score: number;
    feedback: string;
    createdAt: Date;
    updatedAt: Date;
}

const peerReviewSchema = new Schema<IPeerReview>(
    {
        submissionId: {
            type: Schema.Types.ObjectId,
            ref: 'Submission',
            required: true,
        },
        reviewerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        score: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        feedback: {
            type: String,
            required: true,
            minlength: 10,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
peerReviewSchema.index({ submissionId: 1, reviewerId: 1 }, { unique: true }); // Use can review a submission only once
peerReviewSchema.index({ submissionId: 1 });

export const PeerReview = mongoose.model<IPeerReview>('PeerReview', peerReviewSchema);
