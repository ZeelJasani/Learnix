import mongoose from 'mongoose';
import { Activity, IActivity, ActivityType } from '../models/Activity';
import { ActivityCompletion, IActivityCompletion } from '../models/ActivityCompletion';
import { Enrollment } from '../models/Enrollment';
import { ApiError } from '../utils/apiError';

interface CreateActivityData {
    title: string;
    description?: string;
    type?: ActivityType;
    startDate?: Date;
    dueDate?: Date;
    courseId: string;
}

interface UpdateActivityData {
    title?: string;
    description?: string;
    type?: ActivityType;
    startDate?: Date;
    dueDate?: Date;
}

export class ActivityService {
    /**
     * Get activities for enrolled courses
     */
    static async getForUser(userId: string): Promise<IActivity[]> {
        // Get user's enrolled courses
        const enrollments = await Enrollment.find({
            userId: new mongoose.Types.ObjectId(userId),
            status: 'Active',
        }).select('courseId');

        const courseIds = enrollments.map(e => e.courseId);

        // Get activities for those courses
        const activities = await Activity.find({
            courseId: { $in: courseIds },
        })
            .sort({ dueDate: 1, createdAt: -1 })
            .populate('courseId', 'title slug')
            .lean();

        // Get completions for this user
        const activityIds = activities.map(a => a._id);
        const completions = await ActivityCompletion.find({
            userId: new mongoose.Types.ObjectId(userId),
            activityId: { $in: activityIds },
        }).lean();

        const completionMap = new Map(
            completions.map(c => [c.activityId.toString(), c])
        );

        // Add completion status to activities
        return activities.map(activity => ({
            ...activity,
            completed: completionMap.has(activity._id.toString()),
            completedAt: completionMap.get(activity._id.toString())?.completedAt,
        })) as unknown as IActivity[];
    }

    /**
     * Get activities for a course (admin)
     */
    static async getByCourseId(courseIdOrSlug: string): Promise<IActivity[]> {
        let courseId = courseIdOrSlug;

        if (!mongoose.Types.ObjectId.isValid(courseIdOrSlug)) {
            const course = await import('../models/Course').then(m => m.Course.findOne({ slug: courseIdOrSlug }).select('_id'));
            if (!course) {
                throw ApiError.badRequest('Invalid course ID from Activity Service');
            }
            courseId = course._id.toString();
        }

        const activities = await Activity.find({ courseId: new mongoose.Types.ObjectId(courseId) })
            .sort({ dueDate: 1, createdAt: -1 })
            .lean();

        // Transform for frontend: _id -> id, added _count stub
        return activities.map(activity => ({
            ...activity,
            id: (activity as any)._id.toString(),
            _count: { completions: 0 } // Stub to prevent frontend crash
        })) as unknown as IActivity[];
    }

    /**
     * Create a new activity
     */
    static async create(data: CreateActivityData): Promise<IActivity> {
        let courseId = data.courseId;

        if (!mongoose.Types.ObjectId.isValid(data.courseId)) {
            const course = await import('../models/Course').then(m => m.Course.findOne({ slug: data.courseId }).select('_id'));
            if (!course) {
                throw ApiError.badRequest('Invalid course ID');
            }
            courseId = course._id.toString();
        }

        const activity = new Activity({
            title: data.title,
            description: data.description || null,
            type: data.type || 'ASSIGNMENT',
            startDate: data.startDate || null,
            dueDate: data.dueDate || null,
            courseId: new mongoose.Types.ObjectId(courseId),
        });

        await activity.save();
        return activity;
    }

    /**
     * Update an activity
     */
    static async update(id: string, data: UpdateActivityData): Promise<IActivity | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw ApiError.badRequest('Invalid activity ID');
        }

        return Activity.findByIdAndUpdate(id, data, { new: true });
    }

    /**
     * Delete an activity
     */
    static async delete(id: string): Promise<boolean> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw ApiError.badRequest('Invalid activity ID');
        }

        // Delete completions first
        await ActivityCompletion.deleteMany({ activityId: new mongoose.Types.ObjectId(id) });

        const result = await Activity.findByIdAndDelete(id);
        return !!result;
    }

    /**
     * Mark activity as complete
     */
    static async complete(activityId: string, userId: string): Promise<IActivityCompletion> {
        if (!mongoose.Types.ObjectId.isValid(activityId)) {
            throw ApiError.badRequest('Invalid activity ID');
        }

        // Check if activity exists
        const activity = await Activity.findById(activityId);
        if (!activity) {
            throw ApiError.notFound('Activity not found');
        }

        // Check if user is enrolled in the course
        const enrollment = await Enrollment.findOne({
            userId: new mongoose.Types.ObjectId(userId),
            courseId: activity.courseId,
            status: 'Active',
        });

        if (!enrollment) {
            throw ApiError.forbidden('You must be enrolled in this course');
        }

        // Check if already completed
        const existing = await ActivityCompletion.findOne({
            userId: new mongoose.Types.ObjectId(userId),
            activityId: new mongoose.Types.ObjectId(activityId),
        });

        if (existing) {
            return existing;
        }

        // Create completion
        const completion = new ActivityCompletion({
            userId: new mongoose.Types.ObjectId(userId),
            activityId: new mongoose.Types.ObjectId(activityId),
            completedAt: new Date(),
        });

        await completion.save();
        return completion;
    }

    /**
     * Uncomplete an activity (remove completion)
     */
    static async uncomplete(activityId: string, userId: string): Promise<boolean> {
        const result = await ActivityCompletion.deleteOne({
            userId: new mongoose.Types.ObjectId(userId),
            activityId: new mongoose.Types.ObjectId(activityId),
        });

        return result.deletedCount > 0;
    }
}
