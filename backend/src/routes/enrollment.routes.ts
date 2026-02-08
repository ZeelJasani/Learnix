import { Router } from 'express';
import { EnrollmentController } from '../controllers/enrollment.controller';
import { verifyClerkToken } from '../middleware/auth';
import { requireUser } from '../middleware/requireUser';

const router = Router();


router.use(verifyClerkToken);
router.use(requireUser);

router.get('/:courseId/check', EnrollmentController.checkEnrollment);
router.post('/free', EnrollmentController.freeEnrollment);
router.post('/', EnrollmentController.create);

export default router;
