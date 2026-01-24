import { Router } from 'express';
import { ActivityController } from '../controllers/activity.controller';
import { verifyClerkToken } from '../middleware/auth';
import { requireUser } from '../middleware/requireUser';

const router = Router();

// All routes require authentication
router.use(verifyClerkToken);
router.use(requireUser);

// User activity routes
router.get('/', ActivityController.getForUser);
router.post('/:id/complete', ActivityController.complete);

export default router;
