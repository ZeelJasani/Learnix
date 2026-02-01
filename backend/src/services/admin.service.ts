import mongoose from 'mongoose';
import { User } from '../models/User';
import { Course } from '../models/Course';
import { Lesson } from '../models/Lesson';
import { Enrollment } from '../models/Enrollment';
import { Chapter } from '../models/Chapter';

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
     * Get dashboard statistics
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
     * Get all users with pagination
     */
    static async getAllUsers(page = 1, limit = 20): Promise<{
        users: any[];
        total: number;
        pages: number;
    }> {
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            User.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select('clerkId name email image role banned createdAt')
                .lean(),
            User.countDocuments(),
        ]);

        return {
            users,
            total,
            pages: Math.ceil(total / limit),
        };
    }

    /**
     * Get enrollment statistics
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
     * Get all mentors
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
}
