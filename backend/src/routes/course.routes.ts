import { Router } from 'express';
import { CourseController } from '../controllers/course.controller';
import { optionalUser } from '../middleware/optionalAuth';

const router = Router();

// Public routes - no authentication required
router.get('/', CourseController.getAllPublished);
router.get('/search', CourseController.search);
router.get('/:slug', optionalUser, CourseController.getBySlug);

export default router;
