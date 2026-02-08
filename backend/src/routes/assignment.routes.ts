import express from 'express';
import { AssignmentController } from '../controllers/assignment.controller';
import { verifyClerkToken } from '../middleware/auth';
import { requireUser } from '../middleware/requireUser';

const router = express.Router();

// Apply auth middleware to all routes
router.use(verifyClerkToken);
router.use(requireUser);

// Get my submission for a lesson
router.get('/lesson/:lessonId/my-submission', AssignmentController.getMySubmission);

// Submit an assignment
router.post('/lesson/:lessonId/submit', AssignmentController.submitAssignment);

// Get peer assignments to review
router.get('/lesson/:lessonId/reviews/pending', AssignmentController.getAssignmentsToReview);

// Submit a peer review
router.post('/reviews/:submissionId', AssignmentController.submitReview);

// Get reviews received for my submission
router.get('/lesson/:lessonId/reviews/received', AssignmentController.getReviewsReceived);

export const assignmentRouter = router;
