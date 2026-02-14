// ============================================================================
// Learnix LMS - Enrollment Controller (એનરોલમેન્ટ કંટ્રોલર)
// ============================================================================
// Aa controller enrollment-related HTTP requests handle kare chhe.
// This controller handles enrollment-related HTTP requests.
//
// જવાબદારીઓ / Responsibilities:
// - Enrollment status check (નોંધણી સ્ટેટસ ચકાસણી)
// - Paid enrollment creation via Stripe (Stripe દ્વારા paid enrollment)
// - Free course enrollment (ફ્રી કોર્સ એનરોલમેન્ટ)
// - Enrollment statistics (એનરોલમેન્ટ આંકડા)
// ============================================================================

import { Response, NextFunction } from 'express';
import { UserRequest } from '../middleware/requireUser';
import { EnrollmentService } from '../services/enrollment.service';
import { ApiResponse } from '../utils/apiResponse';

/**
 * EnrollmentController - એનરોલમેન્ટ સંબંધિત API endpoints
 * EnrollmentController - Enrollment-related API endpoints
 *
 * Free ane paid course enrollment process manage kare chhe.
 * Manages both free and paid course enrollment processes.
 */
export class EnrollmentController {

    /**
     * User course ma enrolled chhe ke nahi check karo / Check if user is enrolled in a course
     *
     * Frontend enrollment button display mate aa endpoint use kare chhe.
     * Frontend uses this endpoint to display the appropriate enrollment button.
     *
     * @route GET /api/enrollments/check/:courseId
     */
    static async checkEnrollment(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const { courseId } = req.params;

            // Enrollment status check karo / Check enrollment status
            const result = await EnrollmentService.isEnrolled(userId, courseId);
            ApiResponse.success(res, result);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Paid enrollment create karo (Stripe checkout session) / Create paid enrollment (Stripe checkout session)
     *
     * Amount sathe enrollment record create kare chhe ane Stripe session return kare chhe.
     * Creates enrollment record with amount and returns Stripe checkout session.
     *
     * @route POST /api/enrollments
     */
    static async create(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const { courseId, amount } = req.body;

            // Enrollment create karo / Create enrollment
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

    /**
     * Free course ma enrollment karo / Enroll in a free course
     *
     * Email verification thay chhe - body email ane logged-in user email match thava joiye.
     * Email verification occurs - body email must match logged-in user email.
     *
     * @route POST /api/enrollments/free
     */
    static async freeEnrollment(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const userEmail = req.user!.email;
            const { courseId, email } = req.body;

            // Email mismatch check karo / Check for email mismatch
            if (email !== userEmail) {
                ApiResponse.error(res, 'Email does not match logged-in user', 400);
                return;
            }

            // Free enrollment process karo / Process free enrollment
            const enrollment = await EnrollmentService.freeEnrollment(userId, courseId);
            ApiResponse.success(res, enrollment);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Enrollment statistics kadho / Get enrollment statistics
     *
     * Admin dashboard mate overall enrollment stats return kare chhe.
     * Returns overall enrollment stats for admin dashboard.
     *
     * @route GET /api/enrollments/stats
     */
    static async getStats(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const stats = await EnrollmentService.getStats();
            ApiResponse.success(res, stats);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Payment session verify karo / Verify payment session
     *
     * Stripe session ID thi payment verify kare chhe.
     * Verifies payment using Stripe session ID.
     *
     * @route POST /api/enrollments/verify-payment
     */
    static async verifyPayment(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { sessionId } = req.body;

            if (!sessionId) {
                ApiResponse.error(res, 'Session ID is required', 400);
                return;
            }

            const enrollment = await EnrollmentService.verifyPayment(sessionId, req.user!.id);
            ApiResponse.success(res, enrollment);
        } catch (error) {
            next(error);
        }
    }
}
