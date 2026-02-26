// ============================================================================
// Learnix LMS - Mentor Routes (મેન્ટર રાઉટ્સ)
// ============================================================================
// Aa file mentor-specific API routes define kare chhe.
// This file defines mentor-specific API routes.
//
// Aa file 2 routers export kare chhe:
// This file exports 2 routers:
//
// 1. Default router (Base path: /api/mentor) - 🔒 Authenticated + Mentor role
//    GET /dashboard/stats  - Mentor dashboard statistics
//    GET /courses          - Mentor na courses
//    GET /students         - Mentor na students
//
// 2. mentorPublicRouter (Base path: /api/mentors) - 🔓 Public
//    GET /:id              - Public mentor profile
// ============================================================================

import { Router } from 'express';
import { MentorController } from '../controllers/mentor.controller';
import { verifyClerkToken } from '../middleware/auth';
import { requireUser } from '../middleware/requireUser';
import { requireMentor } from '../middleware/requireMentor';

// ===== Authenticated Mentor Routes / Authenticated Mentor Routes =====
// Mentor dashboard mate routes (auth + mentor role jaruri)
// Routes for mentor dashboard (auth + mentor role required)
const router = Router();

router.use(verifyClerkToken);
router.use(requireUser);
router.use(requireMentor);

// Mentor dashboard statistics kadho / Get mentor dashboard statistics
router.get('/dashboard/stats', MentorController.getDashboardStats);

// Mentor na courses kadho / Get mentor's courses
router.get('/courses', MentorController.getMyCourses);

// Mentor na students kadho / Get mentor's students
router.get('/students', MentorController.getMyStudents);

// Student nu detailed progress kadho / Get student progress detail
router.get('/students/:studentId/progress', MentorController.getStudentProgress);

// Mentor na courses ni submissions kadho / Get submissions for mentor's courses
router.get('/submissions', MentorController.getSubmissions);

// Submission ne review (approve/reject) karo / Review (approve/reject) a submission
router.put('/submissions/:id/review', MentorController.reviewSubmission);

// Mentor na courses ni quizzes kadho / Get quizzes for mentor's courses
router.get('/quizzes', MentorController.getMyQuizzes);

// Mentor na courses ni activities kadho / Get activities for mentor's courses
router.get('/activities', MentorController.getMyActivities);

// ===== Public Mentor Profile Routes / Public Mentor Profile Routes =====
// Auth jaruri nathi - koi pan mentor ni profile joi shake
// No auth needed - anyone can view a mentor's profile
const publicRouter = Router();

// Mentor ni public profile kadho / Get mentor's public profile
publicRouter.get('/:id', MentorController.getMentorProfile);

export default router;
export { publicRouter as mentorPublicRouter };
