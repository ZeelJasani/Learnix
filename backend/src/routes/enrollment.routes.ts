// ============================================================================
// Learnix LMS - Enrollment Routes (એનરોલમેન્ટ રાઉટ્સ)
// ============================================================================
// Aa file enrollment-related API routes define kare chhe.
// This file defines enrollment-related API routes.
//
// Base path: /api/enrollments
//
// રાઉટ્સ / Routes:
// GET  /:courseId/check - Enrollment status check karo
// POST /free           - Free course ma enroll thao
// POST /               - Paid course enrollment (Stripe checkout)
//
// 🔒 Badha routes authenticated chhe (verifyClerkToken + requireUser)
// 🔒 All routes are authenticated (verifyClerkToken + requireUser)
// ============================================================================

import { Router } from 'express';
import { EnrollmentController } from '../controllers/enrollment.controller';
import { verifyClerkToken } from '../middleware/auth';
import { requireUser } from '../middleware/requireUser';

const router = Router();

// Global middleware - badha routes mate auth jaruri / Auth required for all routes
router.use(verifyClerkToken);
router.use(requireUser);

// Enrollment check karo / Check enrollment status
router.get('/:courseId/check', EnrollmentController.checkEnrollment);

// Free enrollment create karo / Create free enrollment
router.post('/free', EnrollmentController.freeEnrollment);

// Paid enrollment create karo (Stripe session) / Create paid enrollment (Stripe session)
router.post('/', EnrollmentController.create);

// Payment verify karo (Success page mate) / Verify payment (for Success page)
router.post('/verify', EnrollmentController.verifyPayment);

export default router;
