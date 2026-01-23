import { Response, NextFunction } from 'express';
import { UserRequest } from '../middleware/requireUser';
import { ChapterService } from '../services/chapter.service';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';

export class ChapterController {
    /**
     * Get chapters for a course
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
     * Create chapter
     */
    static async create(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { name, courseId } = req.body;
            const chapter = await ChapterService.create({ title: name, courseId });
            ApiResponse.created(res, chapter);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update chapter
     */
    static async update(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const chapter = await ChapterService.update(id, req.body);

            if (!chapter) {
                throw ApiError.notFound('Chapter not found');
            }

            ApiResponse.success(res, chapter);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete chapter
     */
    static async delete(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const deleted = await ChapterService.delete(id);

            if (!deleted) {
                throw ApiError.notFound('Chapter not found');
            }

            ApiResponse.success(res, { deleted: true });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Reorder chapters
     */
    static async reorder(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { courseId, items } = req.body;
            await ChapterService.reorder(courseId, items);
            ApiResponse.success(res, { reordered: true });
        } catch (error) {
            next(error);
        }
    }
}
