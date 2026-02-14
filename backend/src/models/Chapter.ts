/**
 * Chapter Model / Chapter Model
 *
 * Aa model course na chapters (sections) store kare chhe.
 * This model stores course chapters (sections).
 *
 * Structure / Structure:
 * Course -> Chapters -> Lessons
 * - Position field ordering mate vaparay chhe
 * - Lessons virtual population thi load thay chhe
 */
import mongoose, { Schema, Document } from 'mongoose';

/**
 * Chapter document interface
 * Aa interface chapter document ni structure define kare chhe
 * This interface defines the chapter document structure
 */
export interface IChapter extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;                      // Chapter nu title / Chapter title
    position: number;                   // Ordering position (0-based)
    courseId: mongoose.Types.ObjectId;   // Parent course nu ID / Parent course ID
    createdAt: Date;
    updatedAt: Date;
}

const chapterSchema = new Schema<IChapter>(
    {
        // Chapter nu title / Chapter title
        title: {
            type: String,
            required: true,
            trim: true,
        },
        // Ordering position - chapters aa number thi sort thay chhe
        // Ordering position - chapters are sorted by this number
        position: {
            type: Number,
            required: true,
            min: 0,
        },
        // Parent course nu reference
        // Reference to parent course
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

// Course na chapters position sathe sort karvaa mate compound index
// Compound index for sorting chapters by position within a course
chapterSchema.index({ courseId: 1, position: 1 });

// Lessons virtual field thi load thay chhe (lazy loading)
// Lessons are loaded via virtual field (lazy loading)
chapterSchema.virtual('lessons', {
    ref: 'Lesson',
    localField: '_id',
    foreignField: 'chapterId',
});

chapterSchema.set('toJSON', { virtuals: true });
chapterSchema.set('toObject', { virtuals: true });

export const Chapter = mongoose.model<IChapter>('Chapter', chapterSchema);
