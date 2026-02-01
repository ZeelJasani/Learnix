import { Request, Response, NextFunction } from 'express';
import { UserRequest } from '../middleware/requireUser';
import { CourseService } from '../services/course.service';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';

export class CourseController {
    /**
     * Get all published courses (public)
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
     * Get course by slug (public)
     */
    static async getBySlug(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { slug } = req.params;
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
     * Search courses (public)
     */
    static async search(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const query = (req.query.q as string) || '';
            const category = req.query.category as string;

            const courses = await CourseService.search(query, category);
            ApiResponse.success(res, courses);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get all courses (admin)
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
     * Get course by ID (admin)
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
     * Create course (admin)
     */
    static async create(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
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
     * Update course (admin)
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
     * Delete course (admin)
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
     * Get recent courses (admin)
     */
    static async getRecent(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const limit = parseInt(req.query.limit as string) || 5;
            const courses = await CourseService.getRecent(limit);
            ApiResponse.success(res, courses);
        } catch (error) {
            next(error);
        }
    }
}
