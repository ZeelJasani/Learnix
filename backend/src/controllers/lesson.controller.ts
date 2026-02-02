import { Response, NextFunction } from 'express';
import { UserRequest } from '../middleware/requireUser';
import { LessonService } from '../services/lesson.service';
import { ApiResponse } from '../utils/apiResponse';

export class LessonController {
    static async getByChapterId(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { chapterId } = req.params;
            const lessons = await LessonService.getByChapterId(chapterId);
            ApiResponse.success(res, lessons);
        } catch (error) {
            next(error);
        }
    }


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

    
    static async getContent(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.user!.id;
            const lesson = await LessonService.getContentForUser(id, userId);
            ApiResponse.success(res, lesson);
        } catch (error) {
            next(error);
        }
    }

    
    static async create(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log('[LessonController] Create request received');
            const { name, courseId, chapterId } = req.body;

           
            if (!name || !chapterId || !courseId) {
                throw new Error("Missing required fields: name, chapterId or courseId");
            }

            console.log(`[LessonController] Creating lesson '${name}' in chapter '${chapterId}'`);

            const lesson = await LessonService.create({
                title: name,
                chapterId,
            });

            console.log('[LessonController] Lesson created successfully:', lesson._id);
            ApiResponse.created(res, lesson);
        } catch (error) {
            console.error('[LessonController] Creation failed:', error);
            next(error);
        }
    }

    
    static async update(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const lesson = await LessonService.update(id, req.body);
            ApiResponse.success(res, lesson);
        } catch (error) {
            next(error);
        }
    }


    static async delete(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            await LessonService.delete(id);
            ApiResponse.success(res, { deleted: true });
        } catch (error) {
            next(error);
        }
    }


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
