import { Router } from 'express';
import { EnrollmentController } from '../controllers/enrollment.controller';
import { verifyClerkToken } from '../middleware/auth';
import { requireUser } from '../middleware/requireUser';

const router = Router();

// All routes require authentication
router.use(verifyClerkToken);
router.use(requireUser);

router.get('/check/:courseId', EnrollmentController.checkEnrollment);
router.post('/', EnrollmentController.create);

export default router;
