/**
 * Admin Service / Admin Service
 *
 * Aa service admin dashboard nu data management handle kare chhe.
 * This service handles admin dashboard data management.
 *
 * Features / Features:
 * - Dashboard stats: Signups, customers, courses, lessons counts
 * - Daily stats: MongoDB aggregation thi daily signup/enrollment trends
 * - User management: Paginated user list, role update
 * - Enrollment stats: Revenue calculation, top courses
 * - Mentor management: Course count, student count per mentor
 * - Content management: Courses with chapters and lessons populated
 */
import mongoose from 'mongoose';
import { User } from '../models/User';
import { Course } from '../models/Course';
import { Lesson } from '../models/Lesson';
import { Enrollment } from '../models/Enrollment';
import { Chapter } from '../models/Chapter';
import { ApiError } from '../utils/apiError';

interface DashboardStats {
    totalSignups: number;
    totalCustomers: number;
    totalCourses: number;
    totalLessons: number;
    recentSignups: number;
    activeUsers: number;
    statsByDate: Array<{
        date: string;
        signups: number;
        enrollments: number;
    }>;
}

export class AdminService {
    /**
     * Admin dashboard mate monthly statistics calculate karo
     * Calculate monthly statistics for admin dashboard
     *
     * Aggregation thi daily signup/enrollment trends generate thay chhe
     * Uses aggregation to generate daily signup/enrollment trends
     */
    static async getDashboardStats(month?: number, year?: number): Promise<DashboardStats> {
        const now = new Date();
        const targetYear = year || now.getFullYear();
        const targetMonth = month !== undefined ? month : now.getMonth();

        const startDate = new Date(targetYear, targetMonth, 1);
        const endDate = new Date(targetYear, targetMonth + 1, 0);

        // Get basic counts
        const [
            totalSignups,
            totalCustomers,
            totalCourses,
            totalLessons,
            monthlySignups,
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({
                _id: { $in: await Enrollment.distinct('userId') },
            }),
            Course.countDocuments({ status: 'PUBLISHED' }),
            Lesson.countDocuments(),
            User.countDocuments({
                createdAt: { $gte: startDate, $lte: endDate },
            }),
        ]);

        // Get daily stats for the month
        const dailySignups = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                    role: { $ne: 'admin' },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                    },
                    count: { $sum: 1 },
                },
            },
        ]);

        const dailyEnrollments = await Enrollment.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                    },
                    count: { $sum: 1 },
                },
            },
        ]);

        // Create maps for quick lookup
        const signupsMap = new Map(dailySignups.map(s => [s._id, s.count]));
        const enrollmentsMap = new Map(dailyEnrollments.map(e => [e._id, e.count]));

        // Build formatted stats for each day
        const statsByDate: Array<{ date: string; signups: number; enrollments: number }> = [];
        const daysInMonth = endDate.getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(Date.UTC(targetYear, targetMonth, day));
            const dateString = date.toISOString().split('T')[0];

            statsByDate.push({
                date: dateString,
                signups: signupsMap.get(dateString) || 0,
                enrollments: enrollmentsMap.get(dateString) || 0,
            });
        }

        return {
            totalSignups,
            totalCustomers,
            totalCourses,
            totalLessons,
            recentSignups: monthlySignups,
            activeUsers: monthlySignups, // Simplified
            statsByDate,
        };
    }

    /**
     * Badha users ni paginated list return karo / Get all users with pagination
     */
    /**
     * Badha users ni paginated list return karo / Get all users with pagination
     */
    static async getAllUsers(page = 1, limit = 20, search = ''): Promise<{
        users: any[];
        total: number;
        pages: number;
    }> {
        const skip = (page - 1) * limit;

        // Search query build karo
        const query: any = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const [users, total] = await Promise.all([
            User.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select('clerkId name email image role banned createdAt')
                .lean(),
            User.countDocuments(query),
        ]);

        const safeUsers = users.map(user => ({
            ...user,
            id: (user._id as mongoose.Types.ObjectId).toString(),
        }));

        return {
            users: safeUsers,
            total,
            pages: Math.ceil(total / limit),
        };
    }

    // User no ban status toggle karo / Toggle user ban status
    static async toggleUserBan(userId: string): Promise<any> {
        const user = await User.findById(userId);

        if (!user) {
            throw ApiError.notFound('User not found');
        }

        // Ban status invert karo
        user.banned = !user.banned;
        await user.save();

        return user;
    }

    /**
     * Enrollment statistics ane revenue data return karo (top 5 courses sathe)
     * Get enrollment statistics and revenue data (with top 5 courses)
     */
    static async getEnrollmentStats(): Promise<{
        totalEnrollments: number;
        activeEnrollments: number;
        revenue: number;
        topCourses: Array<{ courseId: string; title: string; enrollments: number }>;
    }> {
        const [totalEnrollments, activeEnrollments, revenueResult] = await Promise.all([
            Enrollment.countDocuments(),
            Enrollment.countDocuments({ status: 'Active' }),
            Enrollment.aggregate([
                { $match: { status: 'Active' } },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]),
        ]);

        const topCoursesResult = await Enrollment.aggregate([
            { $match: { status: 'Active' } },
            { $group: { _id: '$courseId', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'courses',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'course',
                },
            },
            { $unwind: '$course' },
            {
                $project: {
                    courseId: '$_id',
                    title: '$course.title',
                    enrollments: '$count',
                },
            },
        ]);

        return {
            totalEnrollments,
            activeEnrollments,
            revenue: revenueResult[0]?.total || 0,
            topCourses: topCoursesResult,
        };
    }

    /**
     * Badha mentors ne course count ane student count sathe return karo
     * Get all mentors with their course count and student count
     */
    static async getAllMentors(): Promise<any[]> {
        const mentors = await User.find({ role: 'mentor' })
            .sort({ createdAt: -1 })
            .select('name email image createdAt')
            .lean();

        // Get course count for each mentor
        const mentorsWithStats = await Promise.all(
            mentors.map(async (mentor) => {
                const courseCount = await Course.countDocuments({ userId: mentor._id });
                const enrollments = await Enrollment.countDocuments({
                    courseId: { $in: await Course.find({ userId: mentor._id }).distinct('_id') }
                });

                return {
                    ...mentor,
                    id: mentor._id.toString(),
                    courseCount,
                    studentCount: enrollments,
                };
            })
        );

        return mentorsWithStats;
    }

    // User no role update karo / Update user's role
    static async updateUserRole(userId: string, role: 'admin' | 'mentor' | 'user'): Promise<any> {
        const user = await User.findById(userId);

        if (!user) {
            throw ApiError.notFound('User not found');
        }

        user.role = role;
        await user.save();

        return user;
    }

    // Badha courses chapters ane lessons sathe populated return karo
    // Get all courses with chapters and lessons populated
    static async getAllCoursesWithContent(): Promise<any[]> {
        const courses = await Course.find()
            .populate('userId', 'name email image') // Mentor
            .populate({
                path: 'chapters',
                options: { sort: { position: 1 } },
                populate: {
                    path: 'lessons',
                    options: { sort: { position: 1 } },
                }
            })
            .sort({ createdAt: -1 })
            .lean();

        return courses;
    }
}
