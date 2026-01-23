import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { verifyClerkToken } from '../middleware/auth';
import { requireUser } from '../middleware/requireUser';

const router = Router();

// Sync route only needs Clerk token verification, NOT requireUser
// because the user might not exist in the database yet
router.post('/sync', verifyClerkToken, UserController.syncCurrentUser);

// These routes require the user to exist in the database
router.get('/me', verifyClerkToken, requireUser, UserController.getProfile);
router.get('/enrolled-courses', verifyClerkToken, requireUser, UserController.getEnrolledCourses);

export default router;
