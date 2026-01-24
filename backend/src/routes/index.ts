import { Router } from 'express';
import userRoutes from './user.routes';
import courseRoutes from './course.routes';
import enrollmentRoutes from './enrollment.routes';
import progressRoutes from './progress.routes';
import lessonRoutes from './lesson.routes';
import activityRoutes from './activity.routes';
import adminRoutes from './admin.routes';
import webhookRoutes from './webhook.routes';

const router = Router();

// Health check
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Learnix API is running',
        timestamp: new Date().toISOString(),
    });
});

// API routes
router.use('/users', userRoutes);
router.use('/courses', courseRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/progress', progressRoutes);
router.use('/lessons', lessonRoutes);
router.use('/activities', activityRoutes);
router.use('/admin', adminRoutes);
router.use('/webhooks', webhookRoutes);

export default router;
