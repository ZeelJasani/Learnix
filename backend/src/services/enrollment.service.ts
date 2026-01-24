import mongoose from 'mongoose';
import { Enrollment, IEnrollment, EnrollmentStatus } from '../models/Enrollment';
import { Course } from '../models/Course';
import { Chapter } from '../models/Chapter';
import { Lesson } from '../models/Lesson';
import { LessonProgress } from '../models/LessonProgress';
import { ApiError } from '../utils/apiError';

interface CreateEnrollmentData {
    userId: string;
    courseId: string;
    amount: number;
    status?: EnrollmentStatus;
}

export class EnrollmentService {
    /**
     * Check if user is enrolled in a course
     */
    static async isEnrolled(userId: string, courseId: string): Promise<{ enrolled: boolean; status?: string }> {
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            throw ApiError.badRequest('Invalid course ID');
        }

        const enrollment = await Enrollment.findOne({
            userId: new mongoose.Types.ObjectId(userId),
            courseId: new mongoose.Types.ObjectId(courseId),
        }).select('status');

        if (!enrollment) {
            return { enrolled: false };
        }

        return { enrolled: enrollment.status === 'Active', status: enrollment.status };
    }

    /**
     * Get user's enrolled courses with progress
     */
    static async getEnrolledCourses(userId: string): Promise<any[]> {
        const enrollments = await Enrollment.find({
            userId: new mongoose.Types.ObjectId(userId),
            status: 'Active',
        })
            .select('status courseId')
            .populate({
                path: 'courseId',
                select: 'title smallDescription fileKey level slug duration',
            })
            .lean();

        // Get progress for each course
        const coursesWithProgress = await Promise.all(
            enrollments.map(async (enrollment) => {
                const course = enrollment.courseId as any;

                // Get chapters and lessons for the course
                const chapters = await Chapter.find({ courseId: course._id }).lean();

                const chaptersWithLessons = await Promise.all(
                    chapters.map(async (chapter) => {
                        const lessons = await Lesson.find({ chapterId: chapter._id })
                            .select('_id')
                            .lean();

                        const lessonIds = lessons.map(l => l._id);

                        const progress = await LessonProgress.find({
                            userId: new mongoose.Types.ObjectId(userId),
                            lessonId: { $in: lessonIds },
                        }).lean();

                        return {
                            id: chapter._id,
                            lessons: lessons.map(lesson => ({
                                id: lesson._id,
                                lessonProgress: progress
                                    .filter(p => p.lessonId.toString() === lesson._id.toString())
                                    .map(p => ({
                                        id: p._id,
                                        completed: p.completed,
                                        lessonId: p.lessonId,
                                    })),
                            })),
                        };
                    })
                );

                return {
                    status: enrollment.status,
                    Course: {
                        id: course._id,
                        title: course.title,
                        smallDescription: course.smallDescription,
                        fileKey: course.fileKey,
                        level: course.level,
                        slug: course.slug,
                        duration: course.duration,
                        chapter: chaptersWithLessons,
                    },
                };
            })
        );

        return coursesWithProgress;
    }

    /**
     * Create a new enrollment (pending)
     */
    static async create(data: CreateEnrollmentData): Promise<IEnrollment> {
        if (!mongoose.Types.ObjectId.isValid(data.courseId)) {
            throw ApiError.badRequest('Invalid course ID');
        }

        // Check if already enrolled
        const existing = await Enrollment.findOne({
            userId: new mongoose.Types.ObjectId(data.userId),
            courseId: new mongoose.Types.ObjectId(data.courseId),
        });

        if (existing) {
            if (existing.status === 'Active') {
                throw ApiError.conflict('Already enrolled in this course');
            }
            // Update pending enrollment
            existing.amount = data.amount;
            existing.status = data.status || 'Pending';
            await existing.save();
            return existing;
        }

        const enrollment = new Enrollment({
            userId: new mongoose.Types.ObjectId(data.userId),
            courseId: new mongoose.Types.ObjectId(data.courseId),
            amount: data.amount,
            status: data.status || 'Pending',
        });

        await enrollment.save();
        return enrollment;
    }

    /**
     * Activate enrollment (after payment)
     */
    static async activate(enrollmentId: string, userId: string, courseId: string, amount?: number): Promise<IEnrollment | null> {
        const result = await Enrollment.findOneAndUpdate(
            {
                _id: new mongoose.Types.ObjectId(enrollmentId),
                userId: new mongoose.Types.ObjectId(userId),
                courseId: new mongoose.Types.ObjectId(courseId),
                status: 'Pending',
            },
            {
                status: 'Active',
                ...(amount !== undefined && { amount }),
            },
            { new: true }
        );

        return result;
    }

    /**
     * Cancel enrollment
     */
    static async cancel(enrollmentId: string): Promise<IEnrollment | null> {
        if (!mongoose.Types.ObjectId.isValid(enrollmentId)) {
            throw ApiError.badRequest('Invalid enrollment ID');
        }

        return Enrollment.findByIdAndUpdate(
            enrollmentId,
            { status: 'Cancelled' },
            { new: true }
        );
    }

    /**
     * Delete pending enrollment (cleanup for failed payments)
     */
    static async deletePending(enrollmentId: string, userId: string, courseId: string): Promise<boolean> {
        const result = await Enrollment.deleteOne({
            _id: new mongoose.Types.ObjectId(enrollmentId),
            userId: new mongoose.Types.ObjectId(userId),
            courseId: new mongoose.Types.ObjectId(courseId),
            status: 'Pending',
        });

        return result.deletedCount > 0;
    }

    /**
     * Get enrollment statistics
     */
    static async getStats(): Promise<{
        total: number;
        active: number;
        pending: number;
        cancelled: number;
    }> {
        const [total, active, pending, cancelled] = await Promise.all([
            Enrollment.countDocuments(),
            Enrollment.countDocuments({ status: 'Active' }),
            Enrollment.countDocuments({ status: 'Pending' }),
            Enrollment.countDocuments({ status: 'Cancelled' }),
        ]);

        return { total, active, pending, cancelled };
    }
}
