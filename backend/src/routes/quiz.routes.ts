// ============================================================================
// Learnix LMS - Quiz Routes (ક્વિઝ રાઉટ્સ)
// ============================================================================
// Aa file quiz-related API routes define kare chhe.
// This file defines quiz-related API routes.
//
// Base path: /api/quizzes
//
// 🔓 Public routes (optional auth):
//   GET /course/:courseId - Course ni quizzes kadho (auth hoy to user data aave)
//
// 🔒 Student routes (authenticated):
//   GET  /:id/for-taking          - Quiz leva mate kadho (answers nahi)
//   GET  /:id/can-take            - Eligibility check karo
//   POST /:id/start               - Navo attempt start karo
//   POST /attempts/:attemptId/submit - Attempt submit karo
//   GET  /:id/attempts            - Attempt history kadho
//   GET  /attempts/:attemptId     - Specific attempt kadho
//
// 🔒 Admin/Instructor routes (requireAdmin):
//   POST /          - Quiz create karo
//   PUT  /:id       - Quiz update karo
//   DELETE /:id     - Quiz delete karo
//   GET  /:id       - Quiz kadho (answers sathe)
//   GET  /:id/statistics - Quiz statistics kadho
// ============================================================================

import express from 'express';
import { QuizController } from '../controllers/quiz.controller';
import { verifyClerkToken, optionalVerifyClerkToken } from '../middleware/auth';
import { requireUser, optionalRequireUser } from '../middleware/requireUser';
import { requireAdmin } from '../middleware/requireAdmin';
import { requireMentor } from '../middleware/requireMentor';

const router = express.Router();

// ===== Public Routes (Optional Auth) / પબ્લિક રાઉટ્સ (Optional Auth) =====
// Auth optional - authenticated user hoy to user-specific data aave
// Auth optional - returns user-specific data if authenticated
router.get('/course/:courseId', optionalVerifyClerkToken, optionalRequireUser, QuizController.getByCourseId);

// ===== Student Routes (Authenticated) / સ્ટુડન્ટ રાઉટ્સ (Authenticated) =====
// Aa routes mate authentication jaruri chhe / These routes require authentication
router.use(verifyClerkToken);
router.use(requireUser);

// Quiz taking mate kadho (correct answers vagar) / Get quiz for taking (without answers)
router.get('/:id/for-taking', QuizController.getForTaking);

// User quiz levi shake ke nahi check karo / Check if user can take quiz
router.get('/:id/can-attempt', QuizController.canAttempt);

// Navo quiz attempt start karo / Start a new quiz attempt
router.post('/:id/start', QuizController.startAttempt);

// Quiz attempt submit karo / Submit quiz attempt
router.post('/:id/attempt', QuizController.submitAttempt);

// Attempt history kadho / Get attempt history
router.get('/:id/attempts', QuizController.getAttemptHistory);

// Quiz attempt submit karo (frontend pattern) / Submit quiz attempt
router.post('/attempts/:attemptId/submit', QuizController.submitAttemptById);

// Specific attempt kadho / Get a specific attempt
router.get('/attempts/:attemptId', QuizController.getAttemptById);

// ===== Admin/Instructor Routes / એડમિન/ઇન્સ્ટ્રક્ટર રાઉટ્સ =====
// Quiz CRUD - faqat admin access kari shake / Quiz CRUD - admin access only

// Quiz create karo / Create quiz
router.post('/', requireMentor, QuizController.create);

// Quiz update karo / Update quiz
router.put('/:id', requireMentor, QuizController.update);

// Quiz delete karo / Delete quiz
router.delete('/:id', requireMentor, QuizController.deleteQuiz);

// Quiz kadho (admin mate answers sathe) / Get quiz (with answers for admin)
router.get('/:id', QuizController.getById);

// Quiz statistics kadho / Get quiz statistics
router.get('/:id/statistics', requireAdmin, QuizController.getStats);

export const quizRouter = router;
