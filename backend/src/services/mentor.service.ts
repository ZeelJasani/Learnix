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

        return {
            courseCount,
            studentCount,
            totalRevenue,
        };
    }

    /**
     * Mentor na badha courses return karo / Get all courses created by a mentor
     */
    static async getMyCourses(mentorId: string) {
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
    static async getMentorProfile(mentorId: string) {
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
}
