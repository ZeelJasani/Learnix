import mongoose from 'mongoose';
import { LessonProgress, ILessonProgress } from '../models/LessonProgress';
import { Lesson } from '../models/Lesson';
import { Chapter } from '../models/Chapter';
import { Enrollment } from '../models/Enrollment';
import { ApiError } from '../utils/apiError';

export class ProgressService {
    /**
     * Mark lesson as complete/incomplete
     */
    static async markLessonComplete(
        userId: string,
        lessonId: string,
        completed = true
    ): Promise<ILessonProgress> {
        if (!mongoose.Types.ObjectId.isValid(lessonId)) {
            throw ApiError.badRequest('Invalid lesson ID');
        }

        // Verify lesson exists and user is enrolled
        const lesson = await Lesson.findById(lessonId).lean();
        if (!lesson) {
            throw ApiError.notFound('Lesson not found');
        }

        const chapter = await Chapter.findById(lesson.chapterId).lean();
        if (!chapter) {
            throw ApiError.notFound('Chapter not found');
        }

        const enrollment = await Enrollment.findOne({
            userId: new mongoose.Types.ObjectId(userId),
            courseId: chapter.courseId,
            status: 'Active',
        });

        if (!enrollment) {
            throw ApiError.forbidden('You must be enrolled in this course');
        }

        // Upsert progress
        const progress = await LessonProgress.findOneAndUpdate(
            {
                userId: new mongoose.Types.ObjectId(userId),
                lessonId: new mongoose.Types.ObjectId(lessonId),
            },
            { completed },
            { upsert: true, new: true }
        );

        return progress;
    }

    /**
     * Get progress for a specific lesson
     */
    static async getLessonProgress(userId: string, lessonId: string): Promise<ILessonProgress | null> {
        return LessonProgress.findOne({
            userId: new mongoose.Types.ObjectId(userId),
            lessonId: new mongoose.Types.ObjectId(lessonId),
        });
    }

    /**
     * Get course progress for a user
     */
    static async getCourseProgress(
        userId: string,
        courseIdOrSlug: string
    ): Promise<{
        totalLessons: number;
        completedLessons: number;
        progressPercentage: number;
        chapterProgress: Array<{
            chapterId: string;
            title: string;
            completed: number;
            total: number;
        }>;
    }> {
        let courseId = courseIdOrSlug;

        if (!mongoose.Types.ObjectId.isValid(courseIdOrSlug)) {
            const course = await import('../models/Course').then(m => m.Course.findOne({ slug: courseIdOrSlug }).select('_id'));
            if (!course) {
                throw ApiError.badRequest('Invalid course ID');
            }
            courseId = course._id.toString();
        }

        // Verify enrollment
        const enrollment = await Enrollment.findOne({
            userId: new mongoose.Types.ObjectId(userId),
            courseId: new mongoose.Types.ObjectId(courseId),
            status: 'Active',
        });

        if (!enrollment) {
            throw ApiError.forbidden('You must be enrolled in this course');
        }

        // Get all chapters and lessons
        const chapters = await Chapter.find({ courseId: new mongoose.Types.ObjectId(courseId) })
            .sort({ position: 1 })
            .lean();

        let totalLessons = 0;
        let completedLessons = 0;
        const chapterProgress: Array<{
            chapterId: string;
            title: string;
            completed: number;
            total: number;
        }> = [];

        for (const chapter of chapters) {
            const lessons = await Lesson.find({ chapterId: chapter._id })
                .select('_id')
                .lean();

            const lessonIds = lessons.map(l => l._id);
            totalLessons += lessonIds.length;

            const completedCount = await LessonProgress.countDocuments({
                userId: new mongoose.Types.ObjectId(userId),
                lessonId: { $in: lessonIds },
                completed: true,
            });

            completedLessons += completedCount;

            chapterProgress.push({
                chapterId: chapter._id.toString(),
                title: chapter.title,
                completed: completedCount,
                total: lessonIds.length,
            });
        }

        const progressPercentage = totalLessons > 0
            ? Math.round((completedLessons / totalLessons) * 100)
            : 0;

        return {
            totalLessons,
            completedLessons,
            progressPercentage,
            chapterProgress,
        };
    }

    /**
     * Reset course progress for a user
     */
    static async resetCourseProgress(userId: string, courseIdOrSlug: string): Promise<number> {
        let courseId = courseIdOrSlug;

        if (!mongoose.Types.ObjectId.isValid(courseIdOrSlug)) {
            const course = await import('../models/Course').then(m => m.Course.findOne({ slug: courseIdOrSlug }).select('_id'));
            if (!course) {
                throw ApiError.badRequest('Invalid course ID');
            }
            courseId = course._id.toString();
        }

        // Get all lessons in the course
        const chapters = await Chapter.find({ courseId: new mongoose.Types.ObjectId(courseId) }).lean();
        const chapterIds = chapters.map(c => c._id);

        const lessons = await Lesson.find({ chapterId: { $in: chapterIds } }).lean();
        const lessonIds = lessons.map(l => l._id);

        // Delete all progress
        const result = await LessonProgress.deleteMany({
            userId: new mongoose.Types.ObjectId(userId),
            lessonId: { $in: lessonIds },
        });

        return result.deletedCount;
    }
}
