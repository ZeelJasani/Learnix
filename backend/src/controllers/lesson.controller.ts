// ============================================================================
// Learnix LMS - Lesson Controller (લેસન કંટ્રોલર)
// ============================================================================
// Aa controller lesson-related HTTP requests handle kare chhe.
// This controller handles lesson-related HTTP requests.
//
// જવાબદારીઓ / Responsibilities:
// - Chapter na lessons listing (ચેપ્ટરના લેસન્સ લિસ્ટ)
// - Lesson retrieval by ID (ID દ્વારા લેસન મેળવવો)
// - Lesson content retrieval with enrollment check (એનરોલમેન્ટ ચેક સાથે content)
// - Lesson CRUD operations (લેસન CRUD ઑપરેશન્સ)
// - Lesson reordering (લેસન રીઓર્ડરિંગ)
//
// 🔒 Security Fix: console.log/error → logger.debug/error
// ============================================================================

import { Response, NextFunction } from 'express';
import { UserRequest } from '../middleware/requireUser';
import { LessonService } from '../services/lesson.service';
import { ApiResponse } from '../utils/apiResponse';
import { logger } from '../utils/logger';

/**
 * LessonController - લેસન સંબંધિત API endpoints
 * LessonController - Lesson-related API endpoints
 *
 * Chapter ni andar lessons manage kare chhe - CRUD, content retrieval, reorder.
 * Manages lessons within chapters - CRUD, content retrieval, reorder.
 */
export class LessonController {
    /**
     * Chapter na badha lessons kadho / Get all lessons for a chapter
     *
     * Position order ma lessons return kare chhe.
     * Returns lessons in position order.
     *
     * @route GET /api/lessons/chapter/:chapterId
     */
    static async getByChapterId(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { chapterId } = req.params;
            const lessons = await LessonService.getByChapterId(chapterId);
            ApiResponse.success(res, lessons);
        } catch (error) {
            next(error);
        }
    }

    /**
     * ID dwara lesson kadho / Get lesson by ID
     *
     * Lesson na basic details return kare chhe (content nathi).
     * Returns basic lesson details (without content).
     *
     * @route GET /api/lessons/:id
     */
    static async getById(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const lesson = await LessonService.getById(id);
            if (!lesson) {
                throw new Error("Lesson not found");
            }
            ApiResponse.success(res, lesson);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lesson content kadho (enrolled users mate) / Get lesson content (for enrolled users)
     *
     * Enrollment verify thay chhe - enrolled users ne j content male chhe.
     * Enrollment is verified - only enrolled users receive content.
     *
     * @route GET /api/lessons/:id/content
     */
    static async getContent(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            // Authenticated user ID kadho / Extract authenticated user ID
            const userId = req.user!.id;
            const lesson = await LessonService.getContentForUser(id, userId);
            ApiResponse.success(res, lesson);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Navo lesson create karo / Create a new lesson
     *
     * Name, courseId ane chapterId required chhe. Position auto-increment thay chhe.
     * Name, courseId and chapterId are required. Position is auto-incremented.
     *
     * @route POST /api/lessons
     */
    static async create(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            // Request receive thayo / Request received
            logger.debug('[LessonController] Create request received');
            const { name, courseId, chapterId } = req.body;

            // Required fields validate karo / Validate required fields
            if (!name || !chapterId || !courseId) {
                throw new Error("Missing required fields: name, chapterId or courseId");
            }

            logger.debug(`[LessonController] Creating lesson '${name}' in chapter '${chapterId}'`);

            // Lesson create karo / Create the lesson
            const lesson = await LessonService.create({
                title: name,
                chapterId,
            });

            // Success log karo / Log success
            logger.debug(`[LessonController] Lesson created successfully: ${lesson._id}`);
            ApiResponse.created(res, lesson);
        } catch (error) {
            // Error log karo / Log the error
            logger.error('[LessonController] Creation failed:', error);
            next(error);
        }
    }

    /**
     * Lesson update karo / Update a lesson
     *
     * ID dwara lesson shodhine body data thi update kare chhe.
     * Finds lesson by ID and updates with body data.
     *
     * @route PUT /api/lessons/:id
     */
    static async update(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const lesson = await LessonService.update(id, req.body);
            ApiResponse.success(res, lesson);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lesson delete karo / Delete a lesson
     *
     * Lesson ane associated progress records delete thay chhe.
     * Lesson and associated progress records are deleted.
     *
     * @route DELETE /api/lessons/:id
     */
    static async delete(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            await LessonService.delete(id);
            ApiResponse.success(res, { deleted: true });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lessons ni position reorder karo / Reorder lessons' positions
     *
     * chapterId ane items array body ma ave chhe.
     * chapterId and items array come in the body.
     *
     * @route PUT /api/lessons/reorder
     */
    static async reorder(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { chapterId, items } = req.body;
            await LessonService.reorder(chapterId, items);
            ApiResponse.success(res, { reordered: true });
        } catch (error) {
            next(error);
        }
    }
}
