import { Response, NextFunction } from 'express';
import { UserRequest } from '../middleware/requireUser';
import { MentorService } from '../services/mentor.service';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';

export class MentorController {

    static async getDashboardStats(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const mentorId = req.user!.id;
            const stats = await MentorService.getDashboardStats(mentorId);
            ApiResponse.success(res, stats);
        } catch (error) {
            next(error);
        }
    }


    static async getMyCourses(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const mentorId = req.user!.id;
            const courses = await MentorService.getMyCourses(mentorId);
            ApiResponse.success(res, courses);
        } catch (error) {
            next(error);
        }
    }


    static async getMyStudents(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const mentorId = req.user!.id;
            const students = await MentorService.getMyStudents(mentorId);
            ApiResponse.success(res, students);
        } catch (error) {
            next(error);
        }
    }


    static async getMentorProfile(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const profile = await MentorService.getMentorProfile(id);

            if (!profile) {
                throw ApiError.notFound('Mentor not found');
            }

            ApiResponse.success(res, profile);
        } catch (error) {
            next(error);
        }
    }
}
