// ============================================================================
// Learnix LMS - Mentor Controller (મેન્ટર કંટ્રોલર)
// ============================================================================
// Aa controller mentor-specific HTTP requests handle kare chhe.
// This controller handles mentor-specific HTTP requests.
//
// જવાબદારીઓ / Responsibilities:
// - Mentor dashboard statistics (મેન્ટર ડેશબોર્ડ આંકડા)
// - Mentor's courses listing (મેન્ટરના કોર્સ લિસ્ટ)
// - Students enrolled in mentor's courses (મેન્ટરના students)
// - Public mentor profile (મેન્ટર પ્રોફાઇલ)
// ============================================================================

import { Response, NextFunction } from 'express';
import { UserRequest } from '../middleware/requireUser';
import { MentorService } from '../services/mentor.service';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';

/**
 * MentorController - મેન્ટર સંબંધિત API endpoints
 * MentorController - Mentor-related API endpoints
 *
 * Mentor dashboard, course management ane student tracking mate endpoints.
 * Endpoints for mentor dashboard, course management and student tracking.
 */
export class MentorController {
    /**
     * Mentor dashboard na statistics kadho / Get mentor dashboard statistics
     *
     * Course count, student count, revenue jeva stats return kare chhe.
     * Returns stats like course count, student count, revenue.
     *
     * @route GET /api/mentor/stats
     */
    static async getDashboardStats(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            // Authenticated mentor ni ID kadho / Extract authenticated mentor's ID
            const mentorId = req.user!.id;
            const stats = await MentorService.getDashboardStats(mentorId);
            ApiResponse.success(res, stats);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Mentor na badha courses kadho / Get all courses created by the mentor
     *
     * Mentor e create karela courses return kare chhe.
     * Returns courses created by the mentor.
     *
     * @route GET /api/mentor/courses
     */
    static async getMyCourses(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const mentorId = req.user!.id;
            const courses = await MentorService.getMyCourses(mentorId);
            ApiResponse.success(res, courses);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Mentor na courses ma enrolled students kadho / Get all students enrolled in mentor's courses
     *
     * Mentor na badha courses across enrolled students nu list.
     * List of students enrolled across all of mentor's courses.
     *
     * @route GET /api/mentor/students
     */
    static async getMyStudents(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const mentorId = req.user!.id;
            const students = await MentorService.getMyStudents(mentorId);
            ApiResponse.success(res, students);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Mentor ni public profile kadho / Get mentor profile (public)
     *
     * Mentor ID dwara profile, stats ane courses return kare chhe.
     * Returns profile, stats and courses by mentor ID.
     *
     * @route GET /api/mentor/:id/profile
     */
    static async getMentorProfile(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const profile = await MentorService.getMentorProfile(id);

            // Mentor na male to 404 / 404 if mentor not found
            if (!profile) {
                throw ApiError.notFound('Mentor not found');
            }

            ApiResponse.success(res, profile);
        } catch (error) {
            next(error);
        }
    }

    // ===== Submissions & Grading =====

    /**
     * Mentor na courses ni submissions kadho / Get submissions for mentor's courses
     * @route GET /api/mentor/submissions
     */
    static async getSubmissions(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const mentorId = req.user!.id;
            const { status } = req.query;
            const submissions = await MentorService.getSubmissions(mentorId, status as string);
            ApiResponse.success(res, submissions);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Submission ne approve ke reject karo / Approve or reject a submission
     * @route PUT /api/mentor/submissions/:id/review
     */
    static async reviewSubmission(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const mentorId = req.user!.id;
            const { id } = req.params;
            const { status, feedback } = req.body;
            const updated = await MentorService.reviewSubmission(mentorId, id, status, feedback);
            ApiResponse.success(res, updated, 'Submission reviewed successfully');
        } catch (error) {
            next(error);
        }
    }

    // ===== Student Progress =====

    /**
     * Student nu detailed progress kadho / Get detailed student progress
     * @route GET /api/mentor/students/:studentId/progress
     */
    static async getStudentProgress(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const mentorId = req.user!.id;
            const { studentId } = req.params;
            const progress = await MentorService.getStudentProgress(mentorId, studentId);
            ApiResponse.success(res, progress);
        } catch (error) {
            next(error);
        }
    }

    // ===== Quiz & Activity Listing =====

    /**
     * Mentor na courses ni quizzes kadho / Get quizzes for mentor's courses
     * @route GET /api/mentor/quizzes
     */
    static async getMyQuizzes(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const mentorId = req.user!.id;
            const quizzes = await MentorService.getMyQuizzes(mentorId);
            ApiResponse.success(res, quizzes);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Mentor na courses ni activities kadho / Get activities for mentor's courses
     * @route GET /api/mentor/activities
     */
    static async getMyActivities(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const mentorId = req.user!.id;
            const activities = await MentorService.getMyActivities(mentorId);
            ApiResponse.success(res, activities);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Course na drop-off rates kadho / Get course drop-off rates
     * @route GET /api/mentor/courses/:courseId/analytics/drop-off
     */
    static async getCourseDropOff(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const mentorId = req.user!.id;
            const { courseId } = req.params;
            const analytics = await MentorService.getCourseDropOff(mentorId, courseId);
            ApiResponse.success(res, analytics);
        } catch (error) {
            next(error);
        }
    }
}
