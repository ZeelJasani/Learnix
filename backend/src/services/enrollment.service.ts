/**
 * Enrollment Service / Enrollment Service
 *
 * Aa service course enrollment ane Stripe payment integration handle kare chhe.
 * This service handles course enrollment and Stripe payment integration.
 *
 * Payment Flow / Payment Flow:
 * - Free courses: Direct enrollment, koi payment nahi
 * - Paid courses: Stripe Checkout Session create thay, payment complete thya pachhi enrollment
 * - Webhook: Stripe webhook thi enrollment auto-create thay chhe
 *
 * Status Lifecycle / Status Lifecycle:
 * - Active: Enrollment successful (free ke paid)
 * - Cancelled: Server-side cancellation
 *
 * Duplicate Prevention / Duplicate Prevention:
 * - userId + courseId compound unique index duplicate enrollment rokke chhe
 */
import mongoose from 'mongoose';
import Stripe from 'stripe';
import { Enrollment, IEnrollment, EnrollmentStatus } from '../models/Enrollment';
import { Course } from '../models/Course';
import { Chapter } from '../models/Chapter';
import { Lesson } from '../models/Lesson';
import { LessonProgress } from '../models/LessonProgress';
import { User } from '../models/User';
import { ApiError } from '../utils/apiError';
import { env } from '../config/env';

interface CreateEnrollmentData {
    userId: string;
    courseId: string;
    amount: number;
    status?: EnrollmentStatus;
}

export class EnrollmentService {
    /**
     * User enrolled chhe ke nahi check karo (courseId ke slug banne chale)
     * Check if user is enrolled (works with both courseId and course slug)
     */
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

    /**
     * User na badha enrollments course details sathe return karo
     * Get enrollments for a user with course details populated
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

    /**
     * Course mate Stripe Checkout Session create karo
     * Create a Stripe checkout session for a course
     *
     * Free course hoy to sidhu enrollment create thay, paid course hoy to Stripe redirect thay
     * Free courses create direct enrollment, paid courses redirect to Stripe
     */
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

    /**
     * Payment success pachhi enrollment handle karo (Stripe webhook thi call thay)
     * Handle successful enrollment after payment (called by Stripe webhook)
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
     * Course na badha enrollments user details sathe return karo
     * Get enrollments for a course with user details populated
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
     * Pending enrollment delete karo
     * Delete a pending enrollment
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

    /**
     * Session ID thi payment verify karo ane enrollment activate karo
     * Verify payment using Session ID and activate enrollment
     */
    static async verifyPayment(sessionId: string, authenticatedUserId?: string): Promise<IEnrollment> {
        const stripe = new Stripe(env.STRIPE_SECRET_KEY);
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        console.log('[VerifyPayment] Session:', JSON.stringify({
            id: session.id,
            payment_status: session.payment_status,
            metadata: session.metadata,
            amount_total: session.amount_total
        }, null, 2));

        if (session.payment_status !== 'paid') {
            throw ApiError.badRequest('Payment not completed');
        }

        const { enrollmentId, userId, courseId } = session.metadata || {};
        const amount = session.amount_total ? Number(session.amount_total) / 100 : 0;

        // Use authenticated user ID as fallback if metadata userId is missing
        const finalUserId = userId || authenticatedUserId;

        if (!finalUserId || !courseId) {
            console.error('[VerifyPayment] Missing metadata:', { userId, authenticatedUserId, courseId, metadata: session.metadata });
            throw ApiError.badRequest('Invalid session metadata: Missing User ID or Course ID');
        }

        let updated: IEnrollment | null = null;

        // Try to activate existing pending enrollment
        if (enrollmentId) {
            updated = await this.activate(enrollmentId, finalUserId, courseId, amount);
        } else {
            // Fallback: find by user and course if enrollmentId is missing
            updated = await Enrollment.findOneAndUpdate(
                {
                    userId: new mongoose.Types.ObjectId(finalUserId),
                    courseId: new mongoose.Types.ObjectId(courseId),
                    status: 'Pending',
                },
                {
                    status: 'Active',
                    amount: amount,
                    paymentId: session.payment_intent as string
                },
                { new: true }
            );
        }

        if (updated) {
            return updated;
        }

        // Check if already active (idempotency)
        const existing = await Enrollment.findOne({
            userId: new mongoose.Types.ObjectId(finalUserId),
            courseId: new mongoose.Types.ObjectId(courseId),
            status: 'Active'
        });

        if (existing) {
            return existing;
        }

        // Create new active enrollment if not found
        const enrollment = new Enrollment({
            userId: new mongoose.Types.ObjectId(finalUserId),
            courseId: new mongoose.Types.ObjectId(courseId),
            amount: amount,
            status: 'Active',
        });

        await enrollment.save();
        return enrollment;
    }
}
