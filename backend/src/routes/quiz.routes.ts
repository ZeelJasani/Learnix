import express from 'express';
import { QuizController } from '../controllers/quiz.controller';
import { verifyClerkToken, optionalVerifyClerkToken } from '../middleware/auth';
import { requireUser, optionalRequireUser } from '../middleware/requireUser';
import { requireAdmin } from '../middleware/requireAdmin';

const router = express.Router();

// Public routes with optional auth (returns user-specific data if authenticated)
router.get('/course/:courseId', optionalVerifyClerkToken, optionalRequireUser, QuizController.getByCourse);

// Apply auth middleware to all other routes
router.use(verifyClerkToken);
router.use(requireUser);

router.get('/:id/for-taking', QuizController.getForTaking); // Get quiz for taking (no answers)
router.get('/:id/can-take', QuizController.canTake); // Check if user can take quiz
router.post('/:id/start', QuizController.startAttempt); // Start new attempt
router.post('/attempts/:attemptId/submit', QuizController.submitAttempt); // Submit attempt
router.get('/:id/attempts', QuizController.getAttemptHistory); // Get attempt history
router.get('/attempts/:attemptId', QuizController.getAttempt); // Get specific attempt

// Admin/Instructor routes
router.post('/', requireAdmin, QuizController.create); // Create quiz
router.put('/:id', requireAdmin, QuizController.update); // Update quiz
router.delete('/:id', requireAdmin, QuizController.delete); // Delete quiz
router.get('/:id', QuizController.getById); // Get quiz by ID (with answers for admin)
router.get('/:id/statistics', requireAdmin, QuizController.getStatistics); // Get quiz stats

export const quizRouter = router;
