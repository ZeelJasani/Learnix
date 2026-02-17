import { Router } from 'express';
import userRoutes from './user.routes';
import courseRoutes from './course.routes';
import enrollmentRoutes from './enrollment.routes';
import progressRoutes from './progress.routes';
import lessonRoutes from './lesson.routes';
import mentorRoutes, { mentorPublicRouter } from './mentor.routes';
import activityRoutes from './activity.routes';
import adminRoutes from './admin.routes';
import webhookRoutes from './webhook.routes';
import { assignmentRouter } from './assignment.routes';
import { quizRouter } from './quiz.routes';
import liveSessionRoutes from './live-session.routes';

const router = Router();


router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Learnix API is running',
        timestamp: new Date().toISOString(),
    });
});

router.use('/users', userRoutes);


router.use('/courses', courseRoutes);

router.use('/enrollments', enrollmentRoutes);


router.use('/progress', progressRoutes);


router.use('/lessons', lessonRoutes);


router.use('/mentor', mentorRoutes);


router.use('/mentors', mentorPublicRouter);


router.use('/activities', activityRoutes);


router.use('/admin', adminRoutes);


router.use('/webhooks', webhookRoutes);


router.use('/assignments', assignmentRouter);


router.use('/quizzes', quizRouter);


router.use('/live-sessions', liveSessionRoutes);

export default router;
