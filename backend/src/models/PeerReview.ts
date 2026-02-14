/**
 * Peer Review Model / Peer Review Model
 *
 * Aa model student submission par peer reviews store kare chhe.
 * This model stores peer reviews on student submissions.
 *
 * Features / Features:
 * - Score: 1-5 (star rating system)
 * - Feedback: minimum 10 characters (meaningful feedback enforce kare chhe)
 * - Ek reviewer ek submission par fakat ek var review kari shake chhe (unique index)
 * - One reviewer can only review a submission once (unique index)
 */
import mongoose, { Schema, Document } from 'mongoose';

/**
 * PeerReview document interface
 * Aa interface peer review document ni structure define kare chhe
 * This interface defines the peer review document structure
 */
export interface IPeerReview extends Document {
    _id: mongoose.Types.ObjectId;
    submissionId: mongoose.Types.ObjectId;  // Reviewed submission nu ID
    reviewerId: mongoose.Types.ObjectId;    // Reviewer (student) nu ID
    score: number;                          // Rating (1-5)
    feedback: string;                       // Review feedback text
    createdAt: Date;
    updatedAt: Date;
}

const peerReviewSchema = new Schema<IPeerReview>(
    {
        // Reviewed submission nu reference
        // Reference to reviewed submission
        submissionId: {
            type: Schema.Types.ObjectId,
            ref: 'Submission',
            required: true,
        },
        // Reviewer student nu reference
        // Reference to reviewer student
        reviewerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        // Score - 1 thi 5 ni range (star rating)
        // Score - range from 1 to 5 (star rating)
        score: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        // Feedback text - minimum 10 characters jaruri chhe
        // Feedback text - minimum 10 characters required
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

// ===== Database Indexes / Database Indexes =====
// Ek reviewer ek submission par fakat ek var review kari shake chhe
// A reviewer can only review a submission once
peerReviewSchema.index({ submissionId: 1, reviewerId: 1 }, { unique: true });

// Submission na reviews shodhvaa mate
// For finding submission's reviews
peerReviewSchema.index({ submissionId: 1 });

export const PeerReview = mongoose.model<IPeerReview>('PeerReview', peerReviewSchema);
