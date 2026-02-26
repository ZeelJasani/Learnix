import { Course } from '../models/Course';
import { Chapter } from '../models/Chapter';
import { Lesson } from '../models/Lesson';
// Using mongoose models directly for efficient ownership lookups
import mongoose from 'mongoose';
import { ApiError } from './apiError';

export class OwnershipService {
    /**
     * Verifies if the user owns the specified course. Admins bypass this check.
     */
    static async verifyCourseOwnership(courseId: string, userId: string, role: string | null): Promise<void> {
        if (role === 'admin') return;

        // Handle case where courseId might be a slug
        const query = mongoose.Types.ObjectId.isValid(courseId)
            ? { _id: courseId }
            : { slug: courseId };

        const course = await Course.findOne(query).select('userId').lean();
        if (!course) throw ApiError.notFound('Course not found');

        if (course.userId.toString() !== userId) {
            throw ApiError.forbidden('Permission denied: You do not own this course');
        }
    }

    /**
     * Verifies if the user owns the chapter (by checking its parent course).
     */
    static async verifyChapterOwnership(chapterId: string, userId: string, role: string | null): Promise<void> {
        if (role === 'admin') return;

        if (!mongoose.Types.ObjectId.isValid(chapterId)) throw ApiError.badRequest('Invalid chapter ID');

        const chapter = await Chapter.findById(chapterId).select('courseId').lean();
        if (!chapter) throw ApiError.notFound('Chapter not found');

        await this.verifyCourseOwnership(chapter.courseId.toString(), userId, role);
    }

    /**
     * Verifies if the user owns the lesson (by checking its parent chapter -> course).
     */
    static async verifyLessonOwnership(lessonId: string, userId: string, role: string | null): Promise<void> {
        if (role === 'admin') return;

        if (!mongoose.Types.ObjectId.isValid(lessonId)) throw ApiError.badRequest('Invalid lesson ID');

        const lesson = await Lesson.findById(lessonId).select('chapterId').lean();
        if (!lesson) throw ApiError.notFound('Lesson not found');

        await this.verifyChapterOwnership(lesson.chapterId.toString(), userId, role);
    }

    /**
     * Verifies if the user owns the activity (by checking its parent course).
     */
    static async verifyActivityOwnership(activityId: string, userId: string, role: string | null): Promise<void> {
        if (role === 'admin') return;

        if (!mongoose.Types.ObjectId.isValid(activityId)) throw ApiError.badRequest('Invalid activity ID');

        // Dynamic import to avoid strict dependency cycles if Activity isn't heavily used
        const { Activity } = await import('../models/Activity');

        const activity = await Activity.findById(activityId).select('courseId').lean();
        if (!activity) throw ApiError.notFound('Activity not found');

        await this.verifyCourseOwnership(activity.courseId.toString(), userId, role);
    }

    /**
     * Verifies if the user owns the quiz (by checking its parent course).
     */
    static async verifyQuizOwnership(quizId: string, userId: string, role: string | null): Promise<void> {
        if (role === 'admin') return;

        if (!mongoose.Types.ObjectId.isValid(quizId)) throw ApiError.badRequest('Invalid quiz ID');

        const { Quiz } = await import('../models/Quiz');

        const quiz = await Quiz.findById(quizId).select('courseId').lean();
        if (!quiz) throw ApiError.notFound('Quiz not found');

        await this.verifyCourseOwnership(quiz.courseId.toString(), userId, role);
    }
}
