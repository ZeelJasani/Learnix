// ============================================================================
// Learnix LMS - Assignment Controller (એસાઇનમેન્ટ કંટ્રોલર)
// ============================================================================
// Aa controller assignment ane peer review HTTP requests handle kare chhe.
// This controller handles assignment and peer review HTTP requests.
//
// જવાબદારીઓ / Responsibilities:
// - Assignment submission (એસાઇનમેન્ટ સબમિશન)
// - Peer review listing ane submission (Peer review)
// - User submission retrieval (યુઝર સબમિશન)
// - Reviews received retrieval (મળેલા reviews)
// ============================================================================

import { Response, NextFunction } from 'express';
import { AssignmentService } from '../services/assignment.service';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';
import { UserRequest } from '../middleware/requireUser';

/**
 * AssignmentController - એસાઇનમેન્ટ સંબંધિત API endpoints
 * AssignmentController - Assignment-related API endpoints
 *
 * Peer review workflow manage kare chhe - submit → review → complete.
 * Manages the peer review workflow - submit → review → complete.
 */
export class AssignmentController {
    /**
     * Assignment submit karo / Submit an assignment
     *
     * Content required chhe. Lesson ID URL parameter ma ave chhe.
     * Content is required. Lesson ID comes as URL parameter.
     *
     * @route POST /api/assignments/:lessonId/submit
     */
    static async submitAssignment(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const { lessonId } = req.params;
            const { content } = req.body;
            const userId = req.user!.id;

            // Content validation karo / Validate content
            if (!content) {
                throw ApiError.badRequest('Content is required');
            }

            // Assignment submit karo / Submit the assignment
            const submission = await AssignmentService.submitAssignment(userId, lessonId, content);
            ApiResponse.created(res, submission, 'Assignment submitted successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * Review mate available assignments kadho / Get assignments available for review
     *
     * Bija users na submissions return kare chhe je review mate available chhe.
     * Returns other users' submissions that are available for review.
     *
     * @route GET /api/assignments/:lessonId/review
     */
    static async getAssignmentsToReview(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const { lessonId } = req.params;
            const userId = req.user!.id;

            const submissions = await AssignmentService.getAssignmentsToReview(userId, lessonId);
            ApiResponse.success(res, submissions);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Review submit karo / Submit a review
     *
     * Score ane feedback required chhe. Submission ID URL parameter ma ave chhe.
     * Score and feedback are required. Submission ID comes as URL parameter.
     *
     * @route POST /api/assignments/:submissionId/review
     */
    static async submitReview(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const { submissionId } = req.params;
            const { score, feedback } = req.body;
            const reviewerId = req.user!.id;

            // Score ane feedback validation karo / Validate score and feedback
            if (!score || !feedback) {
                throw ApiError.badRequest('Score and feedback are required');
            }

            // Review submit karo / Submit the review
            const review = await AssignmentService.submitReview(reviewerId, submissionId, score, feedback);
            ApiResponse.created(res, review, 'Review submitted successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * User ni potani submission kadho / Get user's own submission
     *
     * Lesson mate user e submit karelo assignment return kare chhe.
     * Returns the user's submitted assignment for a lesson.
     *
     * @route GET /api/assignments/:lessonId/my
     */
    static async getMySubmission(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const { lessonId } = req.params;
            const userId = req.user!.id;

            const submission = await AssignmentService.getMySubmission(userId, lessonId);
            // Submission na hoy to null return karo / Return null if no submission
            ApiResponse.success(res, submission ?? null);
        } catch (error) {
            next(error);
        }
    }

    /**
     * User ne malela reviews kadho / Get reviews received by user
     *
     * Lesson mate user ni submission par malela peer reviews return kare chhe.
     * Returns peer reviews received on user's submission for a lesson.
     *
     * @route GET /api/assignments/:lessonId/reviews
     */
    static async getReviewsReceived(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const { lessonId } = req.params;
            const userId = req.user!.id;

            const reviews = await AssignmentService.getReviewsReceived(userId, lessonId);
            ApiResponse.success(res, reviews);
        } catch (error) {
            next(error);
        }
    }
}
