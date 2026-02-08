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
    static async isEnrolled(userId: string, courseIdOrSlug: string): Promise<{ enrolled: boolean; status?: string }> {
        let courseId;


        if (mongoose.Types.ObjectId.isValid(courseIdOrSlug)) {
            courseId = courseIdOrSlug;
        } else {
            const course = await Course.findOne({ slug: courseIdOrSlug }).select('_id').lean();
            if (!course) {
                throw ApiError.notFound('Course not found');
            }
            courseId = course._id.toString();
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

        const coursesWithProgress = await Promise.all(
            enrollments.map(async (enrollment) => {
                const course = enrollment.courseId as any;

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

    static async create(data: CreateEnrollmentData): Promise<IEnrollment> {
        let courseId;

        if (mongoose.Types.ObjectId.isValid(data.courseId)) {
            courseId = data.courseId;
        } else {
            const course = await Course.findOne({ slug: data.courseId }).select('_id').lean();
            if (!course) {
                throw ApiError.notFound('Course not found');
            }
            courseId = course._id.toString();
        }

        const existing = await Enrollment.findOne({
            userId: new mongoose.Types.ObjectId(data.userId),
            courseId: new mongoose.Types.ObjectId(courseId),
        });

        if (existing) {
            if (existing.status === 'Active') {
                throw ApiError.conflict('Already enrolled in this course');
            }
            existing.amount = data.amount;
            existing.status = data.status || 'Pending';
            await existing.save();
            return existing;
        }

        const enrollment = new Enrollment({
            userId: new mongoose.Types.ObjectId(data.userId),
            courseId: new mongoose.Types.ObjectId(courseId),
            amount: data.amount,
            status: data.status || 'Pending',
        });

        await enrollment.save();
        return enrollment;
    }

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

    static async deletePending(enrollmentId: string, userId: string, courseId: string): Promise<boolean> {
        const result = await Enrollment.deleteOne({
            _id: new mongoose.Types.ObjectId(enrollmentId),
            userId: new mongoose.Types.ObjectId(userId),
            courseId: new mongoose.Types.ObjectId(courseId),
            status: 'Pending',
        });

        return result.deletedCount > 0;
    }

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

    static async freeEnrollment(userId: string, courseId: string): Promise<IEnrollment> {
        let resolvedCourseId: string;

        if (mongoose.Types.ObjectId.isValid(courseId)) {
            resolvedCourseId = courseId;
        } else {
            const courseBySlug = await Course.findOne({ slug: courseId }).select('_id price').lean();
            if (!courseBySlug) {
                throw ApiError.notFound('Course not found');
            }
            resolvedCourseId = courseBySlug._id.toString();
        }

        const course = await Course.findById(resolvedCourseId);
        if (!course) {
            throw ApiError.notFound('Course not found');
        }

        if (course.price !== 0) {
            throw ApiError.badRequest('This course is not free');
        }

        const existingEnrollment = await Enrollment.findOne({
            userId: new mongoose.Types.ObjectId(userId),
            courseId: new mongoose.Types.ObjectId(resolvedCourseId),
        });

        if (existingEnrollment) {
            if (existingEnrollment.status === 'Active') {
                return existingEnrollment;
            }
            // If pending or cancelled, reactivate for free
            existingEnrollment.status = 'Active';
            existingEnrollment.amount = 0;
            existingEnrollment.paymentId = `free_${Date.now()}`;
            await existingEnrollment.save();
            return existingEnrollment;
        }

        const enrollment = await Enrollment.create({
            userId: new mongoose.Types.ObjectId(userId),
            courseId: new mongoose.Types.ObjectId(resolvedCourseId),
            amount: 0,
            status: 'Active',
            paymentId: `free_${Date.now()}`,
        });

        return enrollment;
    }
}
