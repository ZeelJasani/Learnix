/**
 * API Routes Index / API Routes Index
 *
 * Badha API routes ek jagya thi register kare chhe.
 * Registers all API routes from a single location.
 *
 * Aa file main Express app ma mount thay chhe '/api' prefix sathe.
 * This file is mounted in the main Express app with '/api' prefix.
 *
 * Route categories / Route categories:
 * - /health - Server health check
 * - /users - User profile management
 * - /courses - Course CRUD
 * - /enrollments - Student enrollment
 * - /progress - Learning progress tracking
 * - /lessons - Lesson management
 * - /mentor - Mentor-specific routes (authenticated)
 * - /mentors - Public mentor profiles
 * - /activities - Learning activities
 * - /admin - Admin-only operations
 * - /webhooks - Clerk, Stripe webhook handlers
 * - /assignments - Assignment management
 * - /quizzes - Quiz management
 * - /live-sessions - Stream.io live sessions
 */
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

// ===== Health Check / Health Check =====
// Server chaltu chhe ke nahi te check karo
// Check if server is running
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Learnix API is running',
        timestamp: new Date().toISOString(),
    });
});

// ===== API Routes Registration / API Routes Registration =====
// User management routes
router.use('/users', userRoutes);

// Course CRUD routes
router.use('/courses', courseRoutes);

// Enrollment management routes
router.use('/enrollments', enrollmentRoutes);

// Learning progress routes
router.use('/progress', progressRoutes);

// Lesson management routes
router.use('/lessons', lessonRoutes);

// Mentor-specific routes (authenticated) / Mentor-specific routes (authenticated)
router.use('/mentor', mentorRoutes);

// Public mentor profiles / Public mentor profiles
router.use('/mentors', mentorPublicRouter);

// Activity management routes
router.use('/activities', activityRoutes);

// Admin-only routes (admin role jaruri chhe) / Admin-only routes (admin role required)
router.use('/admin', adminRoutes);

// Webhook routes (Clerk, Stripe) / Webhook routes (Clerk, Stripe)
router.use('/webhooks', webhookRoutes);

// Assignment management routes
router.use('/assignments', assignmentRouter);

// Quiz management routes
router.use('/quizzes', quizRouter);

// Live session routes (Stream.io integration)
router.use('/live-sessions', liveSessionRoutes);

export default router;
