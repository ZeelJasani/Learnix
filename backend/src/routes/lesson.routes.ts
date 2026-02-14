// ============================================================================
// Learnix LMS - Lesson Routes (લેસન રાઉટ્સ)
// ============================================================================
// Aa file lesson content access API routes define kare chhe.
// This file defines lesson content access API routes.
//
// Base path: /api/lessons
//
// રાઉટ્સ / Routes:
// GET /:id/content - Enrolled user mate lesson content
//
// 🔒 Badha routes authenticated chhe (verifyClerkToken + requireUser)
// 🔒 All routes are authenticated (verifyClerkToken + requireUser)
//
// Note: Lesson CRUD routes admin.routes.ts ma chhe
// Note: Lesson CRUD routes are in admin.routes.ts
// ============================================================================

import { Router } from 'express';
import { LessonController } from '../controllers/lesson.controller';
import { verifyClerkToken } from '../middleware/auth';
import { requireUser } from '../middleware/requireUser';

const router = Router();

// Global middleware - content access mate auth jaruri / Auth required for content access
router.use(verifyClerkToken);
router.use(requireUser);

// Lesson content kadho (enrolled users mate) / Get lesson content (for enrolled users)
router.get('/:id/content', LessonController.getContent);

export default router;
