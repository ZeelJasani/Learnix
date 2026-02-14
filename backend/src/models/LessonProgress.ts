/**
 * Lesson Progress Model / Lesson Progress Model
 *
 * Aa model student nu lesson completion status track kare chhe.
 * This model tracks student lesson completion status.
 *
 * Ek student ek lesson ne fakat ek var complete tarike mark kari shake chhe
 * (unique compound index: userId + lessonId).
 * A student can only mark a lesson as complete once
 * (unique compound index: userId + lessonId).
 */
import mongoose, { Schema, Document } from 'mongoose';

/**
 * LessonProgress document interface
 * Aa interface lesson progress document ni structure define kare chhe
 * This interface defines the lesson progress document structure
 */
export interface ILessonProgress extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;    // Student nu ID / Student's ID
    lessonId: mongoose.Types.ObjectId;  // Lesson nu ID / Lesson's ID
    completed: boolean;                 // Lesson complete thayo ke nahi / Whether lesson is completed
    createdAt: Date;
    updatedAt: Date;
}

const lessonProgressSchema = new Schema<ILessonProgress>(
    {
        // Student nu reference
        // Reference to student
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        // Lesson nu reference
        // Reference to lesson
        lessonId: {
            type: Schema.Types.ObjectId,
            ref: 'Lesson',
            required: true,
        },
        // Completion status
        completed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Duplicate progress entry prevent karvaa mate compound unique index
// Compound unique index to prevent duplicate progress entries
lessonProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

// User na completed lessons filter karvaa mate
// For filtering user's completed lessons
lessonProgressSchema.index({ userId: 1, completed: 1 });

export const LessonProgress = mongoose.model<ILessonProgress>('LessonProgress', lessonProgressSchema);
