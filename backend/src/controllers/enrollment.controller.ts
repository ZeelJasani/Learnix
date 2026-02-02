import { Response, NextFunction } from 'express';
import { UserRequest } from '../middleware/requireUser';
import { EnrollmentService } from '../services/enrollment.service';
import { ApiResponse } from '../utils/apiResponse';

export class EnrollmentController {

    static async checkEnrollment(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const { courseId } = req.params;

            const result = await EnrollmentService.isEnrolled(userId, courseId);
            ApiResponse.success(res, result);
        } catch (error) {
            next(error);
        }
    }


    static async create(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const { courseId, amount } = req.body;

            const enrollment = await EnrollmentService.create({
                userId,
                courseId,
                amount,
            });

            ApiResponse.created(res, enrollment);
        } catch (error) {
            next(error);
        }
    }


    static async getStats(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const stats = await EnrollmentService.getStats();
            ApiResponse.success(res, stats);
        } catch (error) {
            next(error);
        }
    }
}
