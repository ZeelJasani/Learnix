// ============================================================================
// Learnix LMS - Course Controller (કોર્સ કંટ્રોલર)
// ============================================================================
// Aa controller course-related HTTP requests handle kare chhe.
// This controller handles course-related HTTP requests.
//
// જવાબદારીઓ / Responsibilities:
// - Public course listing & search (જાહેર કોર્સ લિસ્ટ અને સર્ચ)
// - Course retrieval by slug/ID (સ્લગ/ID દ્વારા કોર્સ મેળવવો)
// - CRUD operations for admin (એડમિન માટે CRUD ઑપરેશન્સ)
// - Recent courses listing (તાજેતરના કોર્સ લિસ્ટ)
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { UserRequest } from '../middleware/requireUser';
import { CourseService } from '../services/course.service';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';

/**
 * CourseController - કોર્સ સંબંધિત API endpoints
 * CourseController - Course-related API endpoints
 *
 * Public routes (authentication optional) ane Admin routes (authentication required)
 * બંને handle kare chhe.
 * Handles both public routes (authentication optional) and admin routes (authentication required).
 */
export class CourseController {
    /**
     * Badha published courses return karo (Public) / Get all published courses (Public)
     *
     * Authentication required nathi - badha ne visible chhe.
     * No authentication required - visible to everyone.
     *
     * @route GET /api/courses/published
     */
    static async getAllPublished(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const courses = await CourseService.getAllPublished();
            ApiResponse.success(res, courses);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Slug dwara course kadho (Public) / Get course by slug (Public)
     *
     * Authenticated user hoy to enrollment info pan include thay chhe.
     * If authenticated user, enrollment info is also included.
     *
     * @route GET /api/courses/slug/:slug
     */
    static async getBySlug(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { slug } = req.params;
            // User ID optional chhe - enrolled check mate / User ID is optional - for enrollment check
            const course = await CourseService.getBySlug(slug, req.user?.id);

            if (!course) {
                throw ApiError.notFound('Course not found');
            }

            ApiResponse.success(res, course);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Courses search karo (Public) / Search courses (Public)
     *
     * Query string ane category filter support kare chhe.
     * Supports query string and category filter.
     *
     * @route GET /api/courses/search
     */
    static async search(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Search query ane category parse karo / Parse search query and category
            const query = (req.query.q as string) || '';
            const category = req.query.category as string;

            const courses = await CourseService.search(query, category);
            ApiResponse.success(res, courses);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Badha courses kadho (Admin) / Get all courses (Admin)
     *
     * Published ane unpublished banne courses return kare chhe.
     * Returns both published and unpublished courses.
     *
     * @route GET /api/courses (admin)
     */
    static async getAll(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const courses = await CourseService.getAll();
            ApiResponse.success(res, courses);
        } catch (error) {
            next(error);
        }
    }

    /**
     * ID dwara course kadho (Admin) / Get course by ID (Admin)
     *
     * Specific course ni details admin panel mate.
     * Specific course details for admin panel.
     *
     * @route GET /api/courses/:id (admin)
     */
    static async getById(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const course = await CourseService.getById(id);

            if (!course) {
                throw ApiError.notFound('Course not found');
            }

            ApiResponse.success(res, course);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Navo course create karo (Admin) / Create new course (Admin)
     *
     * Request body mathi course data le chhe ane userId attach kare chhe.
     * Takes course data from request body and attaches the userId.
     *
     * @route POST /api/courses (admin)
     */
    static async create(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            // Authenticated user ne creator tarike set karo / Set authenticated user as creator
            const userId = req.user!.id;
            const course = await CourseService.create({
                ...req.body,
                userId,
            });
            ApiResponse.created(res, course);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Course update karo (Admin) / Update course (Admin)
     *
     * ID dwara course shodhine update kare chhe.
     * Finds course by ID and updates it.
     *
     * @route PUT /api/courses/:id (admin)
     */
    static async update(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const course = await CourseService.update(id, req.body);

            if (!course) {
                throw ApiError.notFound('Course not found');
            }

            ApiResponse.success(res, course);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Course delete karo (Admin) / Delete course (Admin)
     *
     * Cascade deletion thay chhe - chapters, lessons pan delete thay chhe.
     * Cascade deletion occurs - chapters, lessons are also deleted.
     *
     * @route DELETE /api/courses/:id (admin)
     */
    static async delete(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const deleted = await CourseService.delete(id);

            if (!deleted) {
                throw ApiError.notFound('Course not found');
            }

            ApiResponse.success(res, { deleted: true });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Recent courses kadho (Admin) / Get recent courses (Admin)
     *
     * Dashboard mate latest courses return kare chhe.
     * Returns latest courses for the dashboard.
     *
     * @route GET /api/courses/recent (admin)
     */
    static async getRecent(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            // Limit parameter parse karo, default 5 / Parse limit parameter, default 5
            const limit = parseInt(req.query.limit as string) || 5;
            const courses = await CourseService.getRecent(limit);
            ApiResponse.success(res, courses);
        } catch (error) {
            next(error);
        }
    }
}
