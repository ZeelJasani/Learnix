import { Response, NextFunction } from 'express';
import { UserRequest } from '../middleware/requireUser';
import { AdminService } from '../services/admin.service';
import { CourseService } from '../services/course.service';
import { ApiResponse } from '../utils/apiResponse';

export class AdminController {
    /**
     * Get dashboard statistics
     */
    static async getDashboardStats(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const month = req.query.month ? parseInt(req.query.month as string) : undefined;
            const year = req.query.year ? parseInt(req.query.year as string) : undefined;

            const stats = await AdminService.getDashboardStats(month, year);
            ApiResponse.success(res, stats);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get all users
     */
    static async getAllUsers(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;

            const result = await AdminService.getAllUsers(page, limit);
            ApiResponse.success(res, result);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get enrollment statistics
     */
    static async getEnrollmentStats(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const stats = await AdminService.getEnrollmentStats();
            ApiResponse.success(res, stats);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get recent courses
     */
    static async getRecentCourses(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const limit = parseInt(req.query.limit as string) || 5;
            const courses = await CourseService.getRecent(limit);
            ApiResponse.success(res, courses);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get all mentors
     */
    static async getAllMentors(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const mentors = await AdminService.getAllMentors();
            ApiResponse.success(res, mentors);
        } catch (error) {
            next(error);
        }
    }
}
