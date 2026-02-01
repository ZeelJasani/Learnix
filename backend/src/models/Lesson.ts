import mongoose, { Schema, Document } from 'mongoose';

export interface ILesson extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string | null;
    thumbnailKey: string | null;
    videoKey: string | null;
    position: number;
    chapterId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const lessonSchema = new Schema<ILesson>(
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
        thumbnailKey: {
            type: String,
            default: null,
        },
        videoKey: {
            type: String,
            default: null,
        },
        position: {
            type: Number,
            required: true,
            min: 0,
        },
        chapterId: {
            type: Schema.Types.ObjectId,
            ref: 'Chapter',
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
lessonSchema.index({ chapterId: 1, position: 1 });

// Virtual for lesson progress
lessonSchema.virtual('lessonProgress', {
    ref: 'LessonProgress',
    localField: '_id',
    foreignField: 'lessonId',
});

lessonSchema.set('toJSON', { virtuals: true });
lessonSchema.set('toObject', { virtuals: true });

export const Lesson = mongoose.model<ILesson>('Lesson', lessonSchema);
