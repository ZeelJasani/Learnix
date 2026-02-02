import { Response, NextFunction } from 'express';
import { UserRequest } from '../middleware/requireUser';
import { ChapterService } from '../services/chapter.service';
import { ApiResponse } from '../utils/apiResponse';

export class ChapterController {

    static async getByCourseId(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { courseId } = req.params;
            const chapters = await ChapterService.getByCourseId(courseId);
            ApiResponse.success(res, chapters);
        } catch (error) {
            next(error);
        }
    }


    static async create(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log('[ChapterController] Create request received');
            const { name, courseId } = req.body;

            if (!name || !courseId) {
                throw new Error("Missing required fields: name or courseId");
            }

            console.log(`[ChapterController] Creating chapter '${name}' for course '${courseId}'`);

            const chapter = await ChapterService.create({
                title: name,
                courseId
            });

            console.log('[ChapterController] Chapter created successfully:', chapter._id);
            ApiResponse.created(res, chapter);
        } catch (error) {
            console.error('[ChapterController] Creation failed:', error);
            next(error);
        }
    }


    static async update(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const chapter = await ChapterService.update(id, req.body);
            ApiResponse.success(res, chapter);
        } catch (error) {
            next(error);
        }
    }


    static async delete(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            await ChapterService.delete(id);
            ApiResponse.success(res, { deleted: true });
        } catch (error) {
            next(error);
        }
    }


    static async reorder(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log('[ChapterController] Reorder request received');
            const { courseId, items } = req.body;

            if (!courseId || !items || !Array.isArray(items)) {
                throw new Error("Invalid reorder payload: missing courseId or items array");
            }

            console.log(`[ChapterController] Reordering ${items.length} chapters for course ${courseId}`);

            await ChapterService.reorder(courseId, items);
            ApiResponse.success(res, { reordered: true });
        } catch (error) {
            console.error('[ChapterController] Reorder failed:', error);
            next(error);
        }
    }
}
