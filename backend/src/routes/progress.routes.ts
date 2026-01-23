import { Router } from 'express';
import { ProgressController } from '../controllers/progress.controller';
import { verifyClerkToken } from '../middleware/auth';
import { requireUser } from '../middleware/requireUser';

const router = Router();

// All routes require authentication
router.use(verifyClerkToken);
router.use(requireUser);

router.post('/lesson/:lessonId', ProgressController.markLessonComplete);
router.get('/course/:courseId', ProgressController.getCourseProgress);
router.delete('/course/:courseId', ProgressController.resetCourseProgress);

export default router;
