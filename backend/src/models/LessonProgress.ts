import mongoose, { Schema, Document } from 'mongoose';

export interface ILessonProgress extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    lessonId: mongoose.Types.ObjectId;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const lessonProgressSchema = new Schema<ILessonProgress>(
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
        completed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Compound unique index to prevent duplicate progress entries
lessonProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });
lessonProgressSchema.index({ userId: 1, completed: 1 });

export const LessonProgress = mongoose.model<ILessonProgress>('LessonProgress', lessonProgressSchema);
