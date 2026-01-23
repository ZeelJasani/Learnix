import { Router } from 'express';
import { LessonController } from '../controllers/lesson.controller';
import { verifyClerkToken } from '../middleware/auth';
import { requireUser } from '../middleware/requireUser';

const router = Router();

// All routes require authentication for content access
router.use(verifyClerkToken);
router.use(requireUser);

// Get lesson content (for enrolled users)
router.get('/:id/content', LessonController.getContent);

export default router;
