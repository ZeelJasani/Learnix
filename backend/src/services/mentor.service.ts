/**
 * Mentor Service / Mentor Service
 *
 * Aa service mentor dashboard, courses, students, ane profile management handle kare chhe.
 * This service handles mentor dashboard, courses, students, and profile management.
 *
 * Features / Features:
 * - Dashboard stats: Course count, student count, total revenue
 * - My courses: Mentor na courses list
 * - My students: Mentor na courses ma enrolled students
 * - Mentor profile: Stats + courses sathe complete profile
 */
import mongoose from 'mongoose';
import { Course } from '../models/Course';
import { Enrollment } from '../models/Enrollment';
import { User } from '../models/User';
import { Submission, SubmissionStatus } from '../models/Submission';
import { Lesson } from '../models/Lesson';
import { Chapter } from '../models/Chapter';
import { LessonProgress } from '../models/LessonProgress';
import { Quiz } from '../models/Quiz';
import { QuizAttempt } from '../models/QuizAttempt';
import { Activity } from '../models/Activity';
import { ActivityCompletion } from '../models/ActivityCompletion';
import { ApiError } from '../utils/apiError';

export class MentorService {
    /**
     * Mentor mate dashboard statistics calculate karo (courses, students, revenue)
     * Calculate dashboard statistics for a mentor (courses, students, revenue)
     */
    static async getDashboardStats(mentorId: string) {
        const mentorObjectId = new mongoose.Types.ObjectId(mentorId);

        // Count courses created by mentor
        const courseCount = await Course.countDocuments({ userId: mentorObjectId });

        // Get all course IDs by this mentor
        const mentorCourses = await Course.find({ userId: mentorObjectId }).select('_id').lean();
        const courseIds = mentorCourses.map(c => c._id);

        // Count unique students enrolled in mentor's courses
        const studentCount = await Enrollment.distinct('userId', {
            courseId: { $in: courseIds },
            status: 'Active'
        }).then(userIds => userIds.length);

        // Calculate total revenue (sum of all completed enrollments)
        const revenueData = await Enrollment.aggregate([
            {
                $match: {
                    courseId: { $in: courseIds },
                    status: 'Active'
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$amount' }
                }
            }
        ]);

        const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

        // --- Monthly Revenue Trend (Last 6 Months) ---
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyRevenue = await Enrollment.aggregate([
            {
                $match: {
                    courseId: { $in: courseIds },
                    status: 'Active',
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    revenue: { $sum: '$amount' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Format for frontend (e.g., "Jan 24")
        const formattedMonthlyRevenue = monthlyRevenue.map(item => {
            const date = new Date(item._id.year, item._id.month - 1);
            return {
                month: date.toLocaleString('en-US', { month: 'short', year: '2-digit' }),
                revenue: item.revenue / 100 // Convert to main currency unit
            };
        });

        // --- Top Courses by Enrollment ---
        const topCoursesData = await Enrollment.aggregate([
            {
                $match: {
                    courseId: { $in: courseIds },
                    status: 'Active'
                }
            },
            {
                $group: {
                    _id: '$courseId',
                    studentCount: { $sum: 1 }
                }
            },
            { $sort: { studentCount: -1 } },
            { $limit: 5 }
        ]);

        // Populate course titles
        const coursePerformance = await Promise.all(topCoursesData.map(async (item) => {
            const course = await Course.findById(item._id).select('title').lean();
            return {
                title: course?.title || 'Unknown',
                students: item.studentCount
            };
        }));

        return {
            courseCount,
            studentCount,
            totalRevenue,
            monthlyRevenue: formattedMonthlyRevenue,
            coursePerformance
        };
    }

    /**
     * Mentor na badha courses return karo / Get all courses created by a mentor
     */
    static async getMyCourses(mentorId: string): Promise<any[]> {
        const mentorObjectId = new mongoose.Types.ObjectId(mentorId);

        const courses = await Course.find({ userId: mentorObjectId })
            .sort({ createdAt: -1 })
            .select('title smallDescription duration level status price fileKey category slug createdAt')
            .lean();

        return courses.map(course => ({
            ...course,
            id: course._id.toString(),
        }));
    }

    /**
     * Mentor na courses ma enrolled badha students return karo
     * Get all students enrolled in mentor's courses
     */
    static async getMyStudents(mentorId: string) {
        const mentorObjectId = new mongoose.Types.ObjectId(mentorId);

        // Get mentor's course IDs
        const mentorCourses = await Course.find({ userId: mentorObjectId }).select('_id title').lean();
        const courseIds = mentorCourses.map(c => c._id);

        // Get enrollments with user details
        const enrollments = await Enrollment.find({
            courseId: { $in: courseIds },
            status: 'Active'
        })
            .populate('userId', 'name email image')
            .populate('courseId', 'title')
            .sort({ createdAt: -1 })
            .lean();

        return enrollments.map(enrollment => ({
            id: enrollment._id.toString(),
            student: {
                id: (enrollment.userId as any)._id.toString(),
                name: (enrollment.userId as any).name,
                email: (enrollment.userId as any).email,
                image: (enrollment.userId as any).image,
            },
            course: {
                id: (enrollment.courseId as any)._id.toString(),
                title: (enrollment.courseId as any).title,
            },
            enrolledAt: enrollment.createdAt,
            amount: enrollment.amount,
        }));
    }

    /**
     * Mentor nu complete profile stats ane courses sathe return karo
     * Get mentor's complete profile with stats and courses
     */
    static async getMentorProfile(mentorId: string): Promise<any> {
        const mentor = await User.findById(mentorId)
            .select('name email image role createdAt')
            .lean();

        if (!mentor || mentor.role !== 'mentor') {
            return null;
        }

        const stats = await this.getDashboardStats(mentorId);
        const courses = await this.getMyCourses(mentorId);

        return {
            ...mentor,
            id: mentor._id.toString(),
            stats,
            courses,
        };
    }

    // ===== Feature 1: Submissions & Grading =====

    /**
     * Mentor na courses ni badhi submissions return karo
     * Get all submissions for courses owned by the mentor
     */
    static async getSubmissions(mentorId: string, statusFilter?: string) {
        const mentorObjectId = new mongoose.Types.ObjectId(mentorId);

        // Get mentor's courses
        const mentorCourses = await Course.find({ userId: mentorObjectId }).select('_id').lean();
        const courseIds = mentorCourses.map(c => c._id);

        // Get chapters belonging to mentor's courses
        const chapters = await Chapter.find({ courseId: { $in: courseIds } }).select('_id').lean();
        const chapterIds = chapters.map(c => c._id);

        // Get lessons belonging to those chapters
        const lessons = await Lesson.find({ chapterId: { $in: chapterIds } }).select('_id title chapterId').lean();
        const lessonIds = lessons.map(l => l._id);

        // Build query filter
        const filter: any = { lessonId: { $in: lessonIds } };
        if (statusFilter && ['submitted', 'approved', 'rejected'].includes(statusFilter)) {
            filter.status = statusFilter;
        }

        // Get submissions with populated data
        const submissions = await Submission.find(filter)
            .populate('userId', 'name email image')
            .populate('lessonId', 'title chapterId')
            .sort({ createdAt: -1 })
            .lean();

        // Enrich with course info
        const lessonToChapterMap = new Map(lessons.map(l => [l._id.toString(), l.chapterId.toString()]));
        const chapterToCourseMap = new Map<string, mongoose.Types.ObjectId>();
        const chaptersWithCourse = await Chapter.find({ _id: { $in: chapterIds } }).select('_id courseId').lean();
        chaptersWithCourse.forEach(ch => chapterToCourseMap.set(ch._id.toString(), ch.courseId));

        const courseMap = new Map<string, string>();
        const allCourses = await Course.find({ _id: { $in: courseIds } }).select('_id title').lean();
        allCourses.forEach(c => courseMap.set(c._id.toString(), c.title));

        return submissions.map((sub: any) => {
            const chapterId = lessonToChapterMap.get(sub.lessonId?._id?.toString() || '');
            const courseId = chapterId ? chapterToCourseMap.get(chapterId) : null;
            const courseTitle = courseId ? courseMap.get(courseId.toString()) : 'Unknown';

            return {
                id: sub._id.toString(),
                student: {
                    id: (sub.userId as any)?._id?.toString(),
                    name: (sub.userId as any)?.name,
                    email: (sub.userId as any)?.email,
                    image: (sub.userId as any)?.image,
                },
                lesson: {
                    id: sub.lessonId?._id?.toString(),
                    title: (sub.lessonId as any)?.title,
                },
                course: courseTitle,
                content: sub.content,
                status: sub.status,
                createdAt: sub.createdAt,
                updatedAt: sub.updatedAt,
            };
        });
    }

    /**
     * Submission ne approve ke reject karo
     * Approve or reject a submission (with ownership verification)
     */
    static async reviewSubmission(mentorId: string, submissionId: string, status: string, feedback?: string) {
        if (!['approved', 'rejected'].includes(status)) {
            throw ApiError.badRequest('Status must be approved or rejected');
        }

        const submission = await Submission.findById(submissionId).lean();
        if (!submission) {
            throw ApiError.notFound('Submission not found');
        }

        // Verify ownership: submission's lesson must belong to mentor's course
        const lesson = await Lesson.findById(submission.lessonId).select('chapterId').lean();
        if (!lesson) throw ApiError.notFound('Lesson not found');

        const chapter = await Chapter.findById(lesson.chapterId).select('courseId').lean();
        if (!chapter) throw ApiError.notFound('Chapter not found');

        const course = await Course.findById(chapter.courseId).select('userId').lean();
        if (!course || course.userId.toString() !== mentorId) {
            throw ApiError.forbidden('You can only review submissions for your own courses');
        }

        const updated = await Submission.findByIdAndUpdate(
            submissionId,
            { status: status as SubmissionStatus },
            { new: true }
        );

        return updated;
    }

    // ===== Feature 2: Student Progress Detail =====

    /**
     * Student nu detailed progress mentor na courses mate return karo
     * Get detailed student progress for mentor's courses
     */
    static async getStudentProgress(mentorId: string, studentId: string) {
        const mentorObjectId = new mongoose.Types.ObjectId(mentorId);
        const studentObjectId = new mongoose.Types.ObjectId(studentId);

        // Get student info
        const student = await User.findById(studentId).select('name email image').lean();
        if (!student) {
            throw ApiError.notFound('Student not found');
        }

        // Get mentor's courses
        const mentorCourses = await Course.find({ userId: mentorObjectId }).select('_id title').lean();
        const courseIds = mentorCourses.map(c => c._id);

        // Get enrollments for this student in mentor's courses
        const enrollments = await Enrollment.find({
            userId: studentObjectId,
            courseId: { $in: courseIds },
            status: 'Active',
        }).lean();

        const enrolledCourseIds = enrollments.map(e => e.courseId);

        // Build progress for each enrolled course
        const coursesProgress = [];

        for (const courseId of enrolledCourseIds) {
            const course = mentorCourses.find(c => c._id.toString() === courseId.toString());
            if (!course) continue;

            // Get chapters & lessons
            const chapters = await Chapter.find({ courseId: course._id }).sort({ position: 1 }).lean();
            const chapterIds = chapters.map(ch => ch._id);
            const allLessons = await Lesson.find({ chapterId: { $in: chapterIds } }).select('_id title chapterId').lean();
            const allLessonIds = allLessons.map(l => l._id);

            // Lesson progress
            const completedLessons = await LessonProgress.find({
                userId: studentObjectId,
                lessonId: { $in: allLessonIds },
                completed: true,
            }).lean();

            const completedLessonIds = new Set(completedLessons.map(lp => lp.lessonId.toString()));

            const totalLessons = allLessons.length;
            const completedCount = completedLessons.length;
            const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

            // Chapter-wise breakdown
            const chapterProgress = chapters.map(ch => {
                const chLessons = allLessons.filter(l => l.chapterId.toString() === ch._id.toString());
                const chCompleted = chLessons.filter(l => completedLessonIds.has(l._id.toString()));
                return {
                    chapterId: ch._id.toString(),
                    title: ch.title,
                    total: chLessons.length,
                    completed: chCompleted.length,
                };
            });

            // Quiz attempts for this course
            const courseQuizzes = await Quiz.find({ courseId: course._id }).select('_id title').lean();
            const quizIds = courseQuizzes.map(q => q._id);
            const quizAttempts = await QuizAttempt.find({
                userId: studentObjectId,
                quizId: { $in: quizIds },
            }).sort({ startedAt: -1 }).lean();

            const quizResults = courseQuizzes.map(quiz => {
                const attempts = quizAttempts.filter(a => a.quizId.toString() === quiz._id.toString());
                const bestAttempt = attempts.reduce((best: any, cur: any) => {
                    if (!best) return cur;
                    return (cur.score || 0) > (best.score || 0) ? cur : best;
                }, null);
                return {
                    quizId: quiz._id.toString(),
                    title: quiz.title,
                    totalAttempts: attempts.length,
                    bestScore: bestAttempt?.score || 0,
                    maxScore: bestAttempt?.maxScore || 0,
                    passed: bestAttempt?.passed || false,
                };
            });

            // Activity completions
            const courseActivities = await Activity.find({ courseId: course._id }).select('_id title type').lean();
            const activityIds = courseActivities.map(a => a._id);
            const completions = await ActivityCompletion.find({
                userId: studentObjectId,
                activityId: { $in: activityIds },
            }).lean();

            const completedActivityIds = new Set(completions.map(c => c.activityId.toString()));

            const activityResults = courseActivities.map(act => ({
                activityId: act._id.toString(),
                title: act.title,
                type: act.type,
                completed: completedActivityIds.has(act._id.toString()),
            }));

            coursesProgress.push({
                courseId: course._id.toString(),
                courseTitle: course.title,
                totalLessons,
                completedLessons: completedCount,
                progressPercentage,
                chapterProgress,
                quizResults,
                activityResults,
            });
        }

        return {
            student: {
                id: student._id.toString(),
                name: student.name,
                email: student.email,
                image: student.image,
            },
            courses: coursesProgress,
        };
    }

    // ===== Feature 3: Quiz & Activity Listing =====

    /**
     * Mentor na courses ni quizzes return karo
     * Get quizzes for mentor's courses
     */
    static async getMyQuizzes(mentorId: string) {
        const mentorObjectId = new mongoose.Types.ObjectId(mentorId);

        const mentorCourses = await Course.find({ userId: mentorObjectId }).select('_id title').lean();
        const courseIds = mentorCourses.map(c => c._id);

        const quizzes = await Quiz.find({ courseId: { $in: courseIds } })
            .populate('courseId', 'title')
            .sort({ createdAt: -1 })
            .lean();

        return quizzes.map((quiz: any) => ({
            id: quiz._id.toString(),
            title: quiz.title,
            description: quiz.description,
            courseId: quiz.courseId?._id?.toString(),
            courseTitle: quiz.courseId?.title,
            timeLimit: quiz.timeLimit,
            passingScore: quiz.passingScore,
            maxAttempts: quiz.maxAttempts,
            isPublished: quiz.isPublished,
            questionsCount: quiz.questions?.length || 0,
            createdAt: quiz.createdAt,
        }));
    }

    /**
     * Mentor na courses ni activities return karo
     * Get activities for mentor's courses
     */
    static async getMyActivities(mentorId: string) {
        const mentorObjectId = new mongoose.Types.ObjectId(mentorId);

        const mentorCourses = await Course.find({ userId: mentorObjectId }).select('_id title').lean();
        const courseIds = mentorCourses.map(c => c._id);

        const activities = await Activity.find({ courseId: { $in: courseIds } })
            .populate('courseId', 'title')
            .sort({ createdAt: -1 })
            .lean();

        return activities.map((act: any) => ({
            id: act._id.toString(),
            title: act.title,
            description: act.description,
            type: act.type,
            courseId: act.courseId?._id?.toString(),
            courseTitle: act.courseId?.title,
            dueDate: act.dueDate,
            startDate: act.startDate,
            createdAt: act.createdAt,
        }));
    }

    /**
     * Course analytics kadho (Drop-off rates per lesson)
     * Get course analytics (Drop-off rates per lesson)
     */
    static async getCourseDropOff(mentorId: string, courseId: string) {
        const course = await Course.findById(courseId).select('_id userId title').lean();
        if (!course) throw ApiError.notFound('Course not found');

        // Check ownership
        if (course.userId.toString() !== mentorId) {
            throw ApiError.forbidden('You only have access to your own course analytics');
        }

        const totalEnrolled = await Enrollment.countDocuments({ courseId: course._id, status: 'Active' });

        // Get chapters and lessons sorted
        const chapters = await Chapter.find({ courseId: course._id }).sort({ position: 1 }).lean();
        const chapterIds = chapters.map(ch => ch._id);
        const lessons = await Lesson.find({ chapterId: { $in: chapterIds } }).sort({ chapterId: 1, position: 1 }).lean();

        const dropOffData = [];
        let prevCompletionCount = totalEnrolled;

        for (const lesson of lessons) {
            const completionCount = await LessonProgress.countDocuments({
                lessonId: lesson._id,
                completed: true
            });

            const completionRate = totalEnrolled > 0 ? Math.round((completionCount / totalEnrolled) * 100) : 0;
            const dropOffFromPrev = prevCompletionCount > 0 ? Math.round(((prevCompletionCount - completionCount) / prevCompletionCount) * 100) : 0;

            dropOffData.push({
                lessonId: lesson._id.toString(),
                lessonTitle: lesson.title,
                completions: completionCount,
                completionRate,
                dropOffRate: Math.max(0, dropOffFromPrev)
            });

            prevCompletionCount = completionCount;
        }

        return {
            courseTitle: course.title,
            totalEnrolled,
            lessons: dropOffData
        };
    }
}
