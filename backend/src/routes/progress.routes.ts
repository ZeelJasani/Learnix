// ============================================================================
// Learnix LMS - Progress Routes (પ્રોગ્રેસ રાઉટ્સ)
// ============================================================================
// Aa file learning progress API routes define kare chhe.
// This file defines learning progress API routes.
//
// Base path: /api/progress
//
// રાઉટ્સ / Routes:
// POST   /lesson/:lessonId  - Lesson complete/incomplete mark karo
// GET    /course/:courseId   - Course progress kadho
// DELETE /course/:courseId   - Course progress reset karo
//
// 🔒 Badha routes authenticated chhe (verifyClerkToken + requireUser)
// 🔒 All routes are authenticated (verifyClerkToken + requireUser)
// ============================================================================

import { Router } from 'express';
import { ProgressController } from '../controllers/progress.controller';
import { verifyClerkToken } from '../middleware/auth';
import { requireUser } from '../middleware/requireUser';

const router = Router();

// Global middleware - badha routes mate auth jaruri / Auth required for all routes
router.use(verifyClerkToken);
router.use(requireUser);

// Lesson complete/incomplete mark karo / Mark lesson as complete/incomplete
router.post('/lesson/:lessonId', ProgressController.markLessonComplete);

// Course progress kadho / Get course progress
router.get('/course/:courseId', ProgressController.getCourseProgress);

// Course progress reset karo / Reset course progress
router.delete('/course/:courseId', ProgressController.resetCourseProgress);

export default router;
