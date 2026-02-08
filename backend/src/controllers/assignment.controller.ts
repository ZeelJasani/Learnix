import { Response, NextFunction } from 'express';
import { AssignmentService } from '../services/assignment.service';
import { ApiError } from '../utils/apiError';
import { UserRequest } from '../middleware/requireUser';

export class AssignmentController {
    static async submitAssignment(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const { lessonId } = req.params;
            const { content } = req.body;
            const userId = req.user!.id;

            if (!content) {
                throw ApiError.badRequest('Content is required');
            }

            const submission = await AssignmentService.submitAssignment(userId, lessonId, content);
            res.status(201).json(submission);
        } catch (error) {
            next(error);
        }
    }

    static async getAssignmentsToReview(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const { lessonId } = req.params;
            const userId = req.user!.id;

            const submissions = await AssignmentService.getAssignmentsToReview(userId, lessonId);
            res.json(submissions);
        } catch (error) {
            next(error);
        }
    }

    static async submitReview(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const { submissionId } = req.params;
            const { score, feedback } = req.body;
            const reviewerId = req.user!.id;

            if (!score || !feedback) {
                throw ApiError.badRequest('Score and feedback are required');
            }

            const review = await AssignmentService.submitReview(reviewerId, submissionId, score, feedback);
            res.status(201).json(review);
        } catch (error) {
            next(error);
        }
    }

    static async getMySubmission(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const { lessonId } = req.params;
            const userId = req.user!.id;

            const submission = await AssignmentService.getMySubmission(userId, lessonId);
            if (!submission) {
                res.status(200).json(null);
                return;
            }
            res.json(submission);
        } catch (error) {
            next(error);
        }
    }

    static async getReviewsReceived(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const { lessonId } = req.params;
            const userId = req.user!.id;

            const reviews = await AssignmentService.getReviewsReceived(userId, lessonId);
            res.json(reviews);
        } catch (error) {
            next(error);
        }
    }
}
