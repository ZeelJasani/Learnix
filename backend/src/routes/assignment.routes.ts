// ============================================================================
// Learnix LMS - Assignment Routes (એસાઇનમેન્ટ રાઉટ્સ)
// ============================================================================
// Aa file assignment ane peer review API routes define kare chhe.
// This file defines assignment and peer review API routes.
//
// Base path: /api/assignments
//
// રાઉટ્સ / Routes:
// GET  /lesson/:lessonId/my-submission     - Potani submission kadho
// POST /lesson/:lessonId/submit            - Assignment submit karo
// GET  /lesson/:lessonId/reviews/pending   - Review mate submissions kadho
// POST /reviews/:submissionId              - Peer review submit karo
// GET  /lesson/:lessonId/reviews/received  - Malela reviews kadho
//
// 🔒 Badha routes authenticated chhe (verifyClerkToken + requireUser)
// 🔒 All routes are authenticated (verifyClerkToken + requireUser)
// ============================================================================

import express from 'express';
import { AssignmentController } from '../controllers/assignment.controller';
import { verifyClerkToken } from '../middleware/auth';
import { requireUser } from '../middleware/requireUser';

const router = express.Router();

// Global middleware - badha routes mate auth jaruri / Auth required for all routes
router.use(verifyClerkToken);
router.use(requireUser);

// Potani submission kadho / Get my submission for a lesson
router.get('/lesson/:lessonId/my-submission', AssignmentController.getMySubmission);

// Assignment submit karo / Submit an assignment
router.post('/lesson/:lessonId/submit', AssignmentController.submitAssignment);

// Peer review mate available assignments kadho / Get peer assignments available for review
router.get('/lesson/:lessonId/reviews/pending', AssignmentController.getAssignmentsToReview);

// Peer review submit karo / Submit a peer review
router.post('/reviews/:submissionId', AssignmentController.submitReview);

// Malela reviews kadho / Get reviews received for my submission
router.get('/lesson/:lessonId/reviews/received', AssignmentController.getReviewsReceived);

export const assignmentRouter = router;
