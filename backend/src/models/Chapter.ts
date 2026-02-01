import mongoose, { Schema, Document } from 'mongoose';

export interface IChapter extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    position: number;
    courseId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const chapterSchema = new Schema<IChapter>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        position: {
            type: Number,
            required: true,
            min: 0,
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
chapterSchema.index({ courseId: 1, position: 1 });

// Virtual for lessons
chapterSchema.virtual('lessons', {
    ref: 'Lesson',
    localField: '_id',
    foreignField: 'chapterId',
});

chapterSchema.set('toJSON', { virtuals: true });
chapterSchema.set('toObject', { virtuals: true });

export const Chapter = mongoose.model<IChapter>('Chapter', chapterSchema);
