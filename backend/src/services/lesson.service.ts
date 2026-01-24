import mongoose from 'mongoose';
import { Lesson, ILesson } from '../models/Lesson';
import { Chapter } from '../models/Chapter';
import { Enrollment } from '../models/Enrollment';
import { LessonProgress } from '../models/LessonProgress';
import { ApiError } from '../utils/apiError';

interface CreateLessonData {
    title: string;
    chapterId: string;
    description?: string;
    thumbnailKey?: string;
    videoKey?: string;
}

interface UpdateLessonData {
    title?: string;
    description?: string;
    thumbnailKey?: string;
    videoKey?: string;
    position?: number;
}

interface ReorderLessonData {
    id: string;
    position: number;
}

export class LessonService {
    /**
     * Get all lessons for a chapter
     */
    static async getByChapterId(chapterId: string): Promise<ILesson[]> {
        if (!mongoose.Types.ObjectId.isValid(chapterId)) {
            throw ApiError.badRequest('Invalid chapter ID');
        }

        return Lesson.find({ chapterId })
            .sort({ position: 1 })
            .lean() as unknown as Promise<ILesson[]>;
    }

    /**
     * Get lesson by ID
     */
    static async getById(id: string): Promise<ILesson | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw ApiError.badRequest('Invalid lesson ID');
        }

        return Lesson.findById(id);
    }

    /**
     * Get lesson content for enrolled user
     */
    static async getContentForUser(lessonId: string, userId: string): Promise<any> {
        if (!mongoose.Types.ObjectId.isValid(lessonId)) {
            throw ApiError.badRequest('Invalid lesson ID');
        }

        const lesson = await Lesson.findById(lessonId)
            .select('title description thumbnailKey videoKey position chapterId')
            .lean();

        if (!lesson) {
            throw ApiError.notFound('Lesson not found');
        }

        // Get the chapter and course info
        const chapter = await Chapter.findById(lesson.chapterId)
            .select('courseId')
            .populate({
                path: 'courseId',
                select: 'slug',
            })
            .lean();

        if (!chapter) {
            throw ApiError.notFound('Chapter not found');
        }

        // Check enrollment
        const enrollment = await Enrollment.findOne({
            userId: new mongoose.Types.ObjectId(userId),
            courseId: chapter.courseId,
            status: 'Active',
        });

        if (!enrollment) {
            throw ApiError.forbidden('You must be enrolled in this course to view this lesson');
        }

        // Get lesson progress
        const progress = await LessonProgress.findOne({
            userId: new mongoose.Types.ObjectId(userId),
            lessonId: new mongoose.Types.ObjectId(lessonId),
        }).select('completed');

        return {
            ...lesson,
            lessonProgress: progress ? [{ completed: progress.completed, lessonId }] : [],
            Chapter: {
                courseId: chapter.courseId,
                Course: {
                    slug: (chapter.courseId as any).slug,
                },
            },
        };
    }

    /**
     * Create a new lesson
     */
    static async create(data: CreateLessonData): Promise<ILesson> {
        if (!mongoose.Types.ObjectId.isValid(data.chapterId)) {
            throw ApiError.badRequest('Invalid chapter ID');
        }

        // Get the next position
        const lastLesson = await Lesson.findOne({ chapterId: data.chapterId })
            .sort({ position: -1 })
            .select('position');

        const position = lastLesson ? lastLesson.position + 1 : 0;

        const lesson = new Lesson({
            title: data.title,
            chapterId: new mongoose.Types.ObjectId(data.chapterId),
            description: data.description || null,
            thumbnailKey: data.thumbnailKey || null,
            videoKey: data.videoKey || null,
            position,
        });

        await lesson.save();
        return lesson;
    }

    /**
     * Update a lesson
     */
    static async update(id: string, data: UpdateLessonData): Promise<ILesson | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw ApiError.badRequest('Invalid lesson ID');
        }

        return Lesson.findByIdAndUpdate(id, data, { new: true });
    }

    /**
     * Delete a lesson
     */
    static async delete(id: string): Promise<boolean> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw ApiError.badRequest('Invalid lesson ID');
        }

        const lesson = await Lesson.findById(id);
        if (!lesson) {
            return false;
        }

        await LessonProgress.deleteMany({ lessonId: id });
        await Lesson.findByIdAndDelete(id);

        // Reorder remaining lessons
        await this.reorderAfterDelete(lesson.chapterId.toString(), lesson.position);

        return true;
    }

    /**
     * Reorder lessons after deletion
     */
    private static async reorderAfterDelete(chapterId: string, deletedPosition: number): Promise<void> {
        await Lesson.updateMany(
            { chapterId, position: { $gt: deletedPosition } },
            { $inc: { position: -1 } }
        );
    }

    /**
     * Reorder lessons
     */
    static async reorder(chapterId: string, items: ReorderLessonData[]): Promise<void> {
        if (!mongoose.Types.ObjectId.isValid(chapterId)) {
            throw ApiError.badRequest('Invalid chapter ID');
        }

        const bulkOps = items.map(item => ({
            updateOne: {
                filter: { _id: new mongoose.Types.ObjectId(item.id), chapterId: new mongoose.Types.ObjectId(chapterId) },
                update: { $set: { position: item.position } },
            },
        }));

        await Lesson.bulkWrite(bulkOps);
    }
}
