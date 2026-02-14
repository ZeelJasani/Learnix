/**
 * Lesson Model / Lesson Model
 *
 * Aa model individual lessons store kare chhe je chapter ma hoy chhe.
 * This model stores individual lessons within a chapter.
 *
 * Lesson Types / Lesson Types:
 * - video: Video content (S3/R2 ma stored)
 * - text: Text/article content
 * - project: Hands-on project
 *
 * Structure / Structure:
 * Course -> Chapters -> Lessons -> LessonProgress
 */
import mongoose, { Schema, Document } from 'mongoose';

/**
 * Lesson document interface
 * Aa interface lesson document ni structure define kare chhe
 * This interface defines the lesson document structure
 */
export interface ILesson extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;                      // Lesson nu title / Lesson title
    description: string | null;         // Lesson description (optional)
    thumbnailKey: string | null;        // S3 thumbnail key
    videoKey: string | null;            // S3 video key
    position: number;                   // Ordering position (0-based)
    chapterId: mongoose.Types.ObjectId; // Parent chapter nu ID / Parent chapter ID
    type: 'video' | 'text' | 'project'; // Lesson content type
    details: any;                       // Flexible content data (Mixed schema)
    createdAt: Date;
    updatedAt: Date;
}

const lessonSchema = new Schema<ILesson>(
    {
        // Lesson nu title / Lesson title
        title: {
            type: String,
            required: true,
            trim: true,
        },
        // Lesson description (optional)
        description: {
            type: String,
            default: null,
        },
        // S3/R2 ma stored thumbnail image ni key
        // Key of thumbnail image stored in S3/R2
        thumbnailKey: {
            type: String,
            default: null,
        },
        // S3/R2 ma stored video ni key
        // Key of video stored in S3/R2
        videoKey: {
            type: String,
            default: null,
        },
        // Ordering position within chapter
        position: {
            type: Number,
            required: true,
            min: 0,
        },
        // Parent chapter nu reference
        // Reference to parent chapter
        chapterId: {
            type: Schema.Types.ObjectId,
            ref: 'Chapter',
            required: true,
            index: true,
        },
        // Content type - yu type nu content chhe
        // Content type - what type of content this is
        type: {
            type: String,
            enum: ['video', 'text', 'project'],
            default: 'video',
        },
        // Flexible details - type-specific data store kare chhe
        // Flexible details - stores type-specific data
        details: {
            type: Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

// Chapter na lessons position sathe sort karvaa mate compound index
// Compound index for sorting lessons by position within a chapter
lessonSchema.index({ chapterId: 1, position: 1 });

// Lesson progress virtual field thi load thay chhe
// Lesson progress loaded via virtual field
lessonSchema.virtual('lessonProgress', {
    ref: 'LessonProgress',
    localField: '_id',
    foreignField: 'lessonId',
});

lessonSchema.set('toJSON', { virtuals: true });
lessonSchema.set('toObject', { virtuals: true });

export const Lesson = mongoose.model<ILesson>('Lesson', lessonSchema);
