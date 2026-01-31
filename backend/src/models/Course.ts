import mongoose, { Schema, Document } from 'mongoose';

export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface ICourse extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    fileKey: string;
    price: number;
    duration: number;
    level: CourseLevel;
    category: string;
    smallDescription: string;
    slug: string;
    status: CourseStatus;
    stripePriceId: string;
    userId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 100,
        },
        description: {
            type: String,
            required: true,
            minlength: 3,
        },
        fileKey: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        duration: {
            type: Number,
            required: true,
            min: 1,
            max: 500,
        },
        level: {
            type: String,
            enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
            default: 'BEGINNER',
        },
        category: {
            type: String,
            required: true,
        },
        smallDescription: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 200,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
            default: 'DRAFT',
        },
        stripePriceId: {
            type: String,
            required: true,
            unique: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
courseSchema.index({ status: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ userId: 1 });
courseSchema.index({ createdAt: -1 });

// Virtual for chapters
courseSchema.virtual('chapters', {
    ref: 'Chapter',
    localField: '_id',
    foreignField: 'courseId',
});

courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

export const Course = mongoose.model<ICourse>('Course', courseSchema);
