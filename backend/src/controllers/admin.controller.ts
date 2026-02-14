// ============================================================================
// Learnix LMS - Admin Controller (એડમિન કંટ્રોલર)
// ============================================================================
// Aa controller admin-specific HTTP requests handle kare chhe.
// This controller handles admin-specific HTTP requests.
//
// જવાબદારીઓ / Responsibilities:
// - Dashboard statistics (ડેશબોર્ડ આંકડા)
// - User management & role updates (યુઝર મેનેજમેન્ટ અને રોલ અપડેટ)
// - Enrollment statistics (એનરોલમેન્ટ આંકડા)
// - Mentor management (મેન્ટર મેનેજમેન્ટ)
// - Course content overview (કોર્સ content overview)
// ============================================================================

import { Response, NextFunction } from 'express';
import { UserRequest } from '../middleware/requireUser';
import { AdminService } from '../services/admin.service';
import { CourseService } from '../services/course.service';
import { ApiResponse } from '../utils/apiResponse';

/**
 * AdminController - એડમિન સંબંધિત API endpoints
 * AdminController - Admin-related API endpoints
 *
 * Admin dashboard mate statistics, user management, mentor management ane
 * course overview endpoints provide kare chhe.
 * Provides statistics, user management, mentor management and
 * course overview endpoints for admin dashboard.
 */
export class AdminController {
    /**
     * Dashboard statistics kadho / Get dashboard statistics
     *
     * Optional month/year filter support kare chhe.
     * Supports optional month/year filter.
     *
     * @route GET /api/admin/stats
     */
    static async getDashboardStats(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            // Optional month/year filter parse karo / Parse optional month/year filter
            const month = req.query.month ? parseInt(req.query.month as string) : undefined;
            const year = req.query.year ? parseInt(req.query.year as string) : undefined;

            const stats = await AdminService.getDashboardStats(month, year);
            ApiResponse.success(res, stats);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Badha users kadho with pagination / Get all users with pagination
     *
     * Page ane limit query parameters accept kare chhe.
     * Accepts page and limit query parameters.
     *
     * @route GET /api/admin/users
     */
    static async getAllUsers(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            // Pagination parameters parse karo / Parse pagination parameters
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const search = (req.query.search as string) || '';

            const result = await AdminService.getAllUsers(page, limit, search);
            ApiResponse.success(res, result);
        } catch (error) {
            next(error);
        }
    }

    /**
     * User no ban status toggle karo / Toggle user's ban status
     *
     * @route PUT /api/admin/users/:id/ban
     */
    static async toggleUserBan(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const user = await AdminService.toggleUserBan(id);
            ApiResponse.success(res, user);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Enrollment statistics kadho / Get enrollment statistics
     *
     * Top courses ane overall enrollment data return kare chhe.
     * Returns top courses and overall enrollment data.
     *
     * @route GET /api/admin/enrollment-stats
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
     * Recent courses kadho / Get recent courses
     *
     * Dashboard mate latest courses return kare chhe.
     * Returns latest courses for the dashboard.
     *
     * @route GET /api/admin/courses/recent
     */
    static async getRecentCourses(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            // Limit parse karo, default 5 / Parse limit, default 5
            const limit = parseInt(req.query.limit as string) || 5;
            const courses = await CourseService.getRecent(limit);
            ApiResponse.success(res, courses);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Badha mentors kadho / Get all mentors
     *
     * Course count ane student count sathe mentors return kare chhe.
     * Returns mentors with course count and student count.
     *
     * @route GET /api/admin/mentors
     */
    static async getAllMentors(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const mentors = await AdminService.getAllMentors();
            ApiResponse.success(res, mentors);
        } catch (error) {
            next(error);
        }
    }

    /**
     * User no role update karo / Update a user's role
     *
     * Valid roles: admin, mentor, user. Invalid role 400 error aape chhe.
     * Valid roles: admin, mentor, user. Invalid role returns 400 error.
     *
     * @route PUT /api/admin/users/:id/role
     */
    static async updateUserRole(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const { role } = req.body;

            // Role validation karo / Validate role
            if (!['admin', 'mentor', 'user'].includes(role)) {
                ApiResponse.error(res, 'Invalid role', 400);
                return;
            }

            const user = await AdminService.updateUserRole(id, role);
            ApiResponse.success(res, user);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Badha courses content sathe kadho / Get all courses with full content
     *
     * Chapters ane lessons sathe courses return kare chhe.
     * Returns courses with chapters and lessons.
     *
     * @route GET /api/admin/courses/content
     */
    static async getCoursesWithContent(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const courses = await AdminService.getAllCoursesWithContent();
            ApiResponse.success(res, courses);
        } catch (error) {
            next(error);
        }
    }
}
