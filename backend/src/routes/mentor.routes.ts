import { Router } from 'express';
import { MentorController } from '../controllers/mentor.controller';
import { verifyClerkToken } from '../middleware/auth';
import { requireUser } from '../middleware/requireUser';
import { requireMentor } from '../middleware/requireMentor';

const router = Router();

// All routes require authentication and mentor role
router.use(verifyClerkToken);
router.use(requireUser);
router.use(requireMentor);

// Mentor dashboard
router.get('/dashboard/stats', MentorController.getDashboardStats);
router.get('/courses', MentorController.getMyCourses);
router.get('/students', MentorController.getMyStudents);

// Public mentor profile (no auth required)
const publicRouter = Router();
publicRouter.get('/:id', MentorController.getMentorProfile);

export default router;
export { publicRouter as mentorPublicRouter };
