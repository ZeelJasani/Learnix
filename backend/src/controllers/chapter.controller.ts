// ============================================================================
// Learnix LMS - Chapter Controller (ચેપ્ટર કંટ્રોલર)
// ============================================================================
// Aa controller chapter-related HTTP requests handle kare chhe.
// This controller handles chapter-related HTTP requests.
//
// જવાબદારીઓ / Responsibilities:
// - Course na chapters listing (કોર્સ ના ચેપ્ટર્સ લિસ્ટ)
// - Chapter CRUD operations (ચેપ્ટર CRUD ઑપરેશન્સ)
// - Chapter reordering with manual validation (ચેપ્ટર રીઓર્ડરિંગ)
//
// 🔒 Security Fix: console.log/error → logger.debug/error
// ============================================================================

import { Response, NextFunction } from 'express';
import { UserRequest } from '../middleware/requireUser';
import { ChapterService } from '../services/chapter.service';
import { ApiResponse } from '../utils/apiResponse';
import { logger } from '../utils/logger';
import { OwnershipService } from '../utils/ownership';

/**
 * ChapterController - ચેપ્ટર સંબંધિત API endpoints
 * ChapterController - Chapter-related API endpoints
 *
 * Course content structure manage kare chhe - chapters create, update, delete, reorder.
 * Manages course content structure - create, update, delete, reorder chapters.
 */
export class ChapterController {
    /**
     * Course na badha chapters kadho / Get chapters for a course
     *
     * Course ID dwara position order ma chapters return kare chhe.
     * Returns chapters in position order by course ID.
     *
     * @route GET /api/chapters/course/:courseId
     */
    static async getByCourseId(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { courseId } = req.params;
            const chapters = await ChapterService.getByCourseId(courseId);
            ApiResponse.success(res, chapters);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Navo chapter create karo / Create a new chapter
     *
     * Name ane courseId required chhe. Position auto-increment thay chhe.
     * Name and courseId are required. Position is auto-incremented.
     *
     * @route POST /api/chapters
     */
    static async create(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            // Request receive thayo / Request received
            logger.debug('[ChapterController] Create request received');
            const { name, courseId } = req.body;

            // Required fields validate karo / Validate required fields
            if (!name || !courseId) {
                throw new Error("Missing required fields: name or courseId");
            }

            // Verify ownership before creating chapter
            await OwnershipService.verifyCourseOwnership(courseId, req.user!.id, req.user!.role);

            logger.debug(`[ChapterController] Creating chapter '${name}' for course '${courseId}'`);

            // Chapter create karo / Create the chapter
            const chapter = await ChapterService.create({
                title: name,
                courseId
            });

            // Success log karo / Log success
            logger.debug(`[ChapterController] Chapter created successfully: ${chapter._id}`);
            ApiResponse.created(res, chapter);
        } catch (error) {
            // Error log karo / Log the error
            logger.error('[ChapterController] Creation failed:', error);
            next(error);
        }
    }

    /**
     * Chapter update karo / Update a chapter
     *
     * ID dwara chapter shodhine body data thi update kare chhe.
     * Finds chapter by ID and updates with body data.
     *
     * @route PUT /api/chapters/:id
     */
    static async update(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            await OwnershipService.verifyChapterOwnership(id, req.user!.id, req.user!.role);
            const chapter = await ChapterService.update(id, req.body);
            ApiResponse.success(res, chapter);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Chapter delete karo / Delete a chapter
     *
     * Chapter sathe tena lessons pan cascade delete thay chhe.
     * Lessons under the chapter are also cascade-deleted.
     *
     * @route DELETE /api/chapters/:id
     */
    static async delete(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            await OwnershipService.verifyChapterOwnership(id, req.user!.id, req.user!.role);
            await ChapterService.delete(id);
            ApiResponse.success(res, { deleted: true });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Chapters ni position reorder karo / Reorder chapters' positions
     *
     * courseId ane items array required chhe. Manual validation thay chhe.
     * courseId and items array are required. Manual validation is performed.
     *
     * @route PUT /api/chapters/reorder
     */
    static async reorder(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            logger.debug('[ChapterController] Reorder request received');
            const { courseId, items } = req.body;

            // Payload validate karo / Validate payload
            if (!courseId || !items || !Array.isArray(items)) {
                throw new Error("Invalid reorder payload: missing courseId or items array");
            }

            await OwnershipService.verifyCourseOwnership(courseId, req.user!.id, req.user!.role);

            logger.debug(`[ChapterController] Reordering ${items.length} chapters for course ${courseId}`);

            // Reorder execute karo / Execute reorder
            await ChapterService.reorder(courseId, items);
            ApiResponse.success(res, { reordered: true });
        } catch (error) {
            // Reorder error log karo / Log reorder error
            logger.error('[ChapterController] Reorder failed:', error);
            next(error);
        }
    }
}
