/**
 * Submission Model / Submission Model
 *
 * Aa model student na lesson submissions (assignments) store kare chhe.
 * This model stores student lesson submissions (assignments).
 *
 * Status Lifecycle / Status Lifecycle:
 * submitted -> approved (mentor/admin approve kare)
 * submitted -> rejected (mentor/admin reject kare, resubmission required)
 *
 * Constraints / Constraints:
 * - Ek student ek lesson ma fakat ek submission kari shake chhe (unique index)
 * - A student can only submit once per lesson (unique index)
 */
import mongoose, { Schema, Document } from 'mongoose';

/**
 * Submission status types
 * Submission ni currently kya state chhe te define kare chhe
 * Defines what state the submission is currently in
 */
export enum SubmissionStatus {
    SUBMITTED = 'submitted',   // Student e submit karyu chhe / Student has submitted
    APPROVED = 'approved',     // Mentor/admin e approve karyu chhe / Approved by mentor/admin
    REJECTED = 'rejected',     // Mentor/admin e reject karyu chhe / Rejected by mentor/admin
}

/**
 * Submission document interface
 * Aa interface submission document ni structure define kare chhe
 * This interface defines the submission document structure
 */
export interface ISubmission extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;      // Student nu ID / Student's ID
    lessonId: mongoose.Types.ObjectId;    // Lesson nu ID / Lesson's ID
    content: string;                      // Submission content (text/URL)
    status: SubmissionStatus;             // Current review status
    createdAt: Date;
    updatedAt: Date;
}

const submissionSchema = new Schema<ISubmission>(
    {
        // Student nu reference
        // Reference to student
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        // Lesson nu reference (assignment lesson)
        // Reference to lesson (assignment lesson)
        lessonId: {
            type: Schema.Types.ObjectId,
            ref: 'Lesson',
            required: true,
        },
        // Submission content - text, code, ke URL hoi shake chhe
        // Submission content - can be text, code, or URL
        content: {
            type: String,
            required: true,
        },
        // Review status
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

// ===== Database Indexes / Database Indexes =====
// Ek student ek lesson mate fakat ek submission kari shake chhe
// One submission per lesson per user
submissionSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

// Lesson na submissions status sathe filter karvaa mate (mentor review mate)
// For filtering lesson submissions by status (for mentor review)
submissionSchema.index({ lessonId: 1, status: 1 });

export const Submission = mongoose.model<ISubmission>('Submission', submissionSchema);
