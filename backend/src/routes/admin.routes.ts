// ============================================================================
// Learnix LMS - Admin Routes (એડમિન રાઉટ્સ)
// ============================================================================
// Aa file admin ane mentor mate protected API routes define kare chhe.
// This file defines protected API routes for admin and mentors.
//
// Base path: /api/admin
//
// 🔒 Badha routes authenticated chhe (verifyClerkToken + requireUser)
// 🔒 All routes are authenticated (verifyClerkToken + requireUser)
//
// Route groups / રાઉટ ગ્રુપ્સ:
//
// Dashboard (requireAdmin):
//   GET /dashboard/stats, /dashboard/users, /dashboard/enrollments,
//       /dashboard/recent-courses, /courses/content
//
// User Management (requireAdmin):
//   GET /users, PUT /users/:id/role
//
// Mentor Management (requireAdmin):
//   GET /mentors
//
// Course CRUD (requireMentor - admin pan access kari shake):
//   GET/POST/PUT/DELETE /courses, /chapters, /lessons, /activities
//
// Uploads (requireMentor):
//   POST /uploads/presigned-url, DELETE /uploads/:key
//
// Enrollment Stats (requireAdmin):
//   GET /enrollments/stats
// ============================================================================

import { Router } from 'express';
import { CourseController } from '../controllers/course.controller';
import { ChapterController } from '../controllers/chapter.controller';
import { LessonController } from '../controllers/lesson.controller';
import { AdminController } from '../controllers/admin.controller';
import { ActivityController } from '../controllers/activity.controller';
import { UploadController } from '../controllers/upload.controller';
import { EnrollmentController } from '../controllers/enrollment.controller';
import { UserController } from '../controllers/user.controller';
import { verifyClerkToken } from '../middleware/auth';
import { requireUser } from '../middleware/requireUser';
import { requireAdmin } from '../middleware/requireAdmin';
import { requireMentor } from '../middleware/requireMentor';
import { validateBody } from '../middleware/validate';
import { createCourseSchema, updateCourseSchema } from '../validations/course.validation';
import { createChapterSchema, reorderChaptersSchema } from '../validations/chapter.validation';
import { createLessonSchema, reorderLessonsSchema } from '../validations/lesson.validation';
import { createActivitySchema, updateActivitySchema } from '../validations/activity.validation';
import { fileUploadSchema } from '../validations/upload.validation';

const router = Router();

// ===== Global Authentication Middleware / Global Authentication Middleware =====
// Badha routes mate Clerk token + DB user jaruri / All routes need Clerk token + DB user
router.use(verifyClerkToken);
router.use(requireUser);

// ===== Dashboard Routes (Admin Only) / ડેશબોર્ડ રાઉટ્સ (Admin Only) =====
// Admin dashboard na statistics ane data endpoints
// Admin dashboard statistics and data endpoints
router.get('/dashboard/stats', requireAdmin, AdminController.getDashboardStats);
router.get('/dashboard/users', requireAdmin, AdminController.getAllUsers);
router.get('/dashboard/enrollments', requireAdmin, AdminController.getEnrollmentStats);
router.get('/dashboard/recent-courses', requireAdmin, AdminController.getRecentCourses);
router.get('/courses/content', requireAdmin, AdminController.getCoursesWithContent);

// ===== User Management (Admin Only) / યુઝર મેનેજમેન્ટ (Admin Only) =====
// Users listing ane role update
// Users listing and role update
router.get('/users', requireAdmin, AdminController.getAllUsers);
router.put('/users/:id/role', requireAdmin, AdminController.updateUserRole);
router.put('/users/:id/ban', requireAdmin, AdminController.toggleUserBan);

// ===== Mentor Management (Admin Only) / મેન્ટર મેનેજમેન્ટ (Admin Only) =====
// Badha mentors ni list / List all mentors
router.get('/mentors', requireAdmin, AdminController.getAllMentors);

// ===== Course Management (Mentor + Admin) / કોર્સ મેનેજમેન્ટ (Mentor + Admin) =====
// requireMentor - mentor ane admin banne access kari shake
// requireMentor - both mentor and admin can access

// Course CRUD / કોર્સ CRUD
router.get('/courses', requireMentor, CourseController.getAll);
router.get('/courses/:id', requireMentor, CourseController.getById);
router.post('/courses', requireMentor, validateBody(createCourseSchema), CourseController.create);
router.put('/courses/:id', requireMentor, validateBody(updateCourseSchema), CourseController.update);
router.delete('/courses/:id', requireMentor, CourseController.delete);

// Chapter CRUD / ચેપ્ટર CRUD
router.get('/chapters/:courseId', requireMentor, ChapterController.getByCourseId);
router.post('/chapters', requireMentor, ChapterController.create);
router.put('/chapters/reorder', requireMentor, ChapterController.reorder);
router.put('/chapters/:id', requireMentor, ChapterController.update);
router.delete('/chapters/:id', requireMentor, ChapterController.delete);

// Lesson CRUD / લેસન CRUD
router.get('/lessons/chapter/:chapterId', requireMentor, LessonController.getByChapterId);
router.get('/lessons/:id', requireMentor, LessonController.getById);
router.post('/lessons', requireMentor, LessonController.create);
router.put('/lessons/reorder', requireMentor, LessonController.reorder);
router.put('/lessons/:id', requireMentor, LessonController.update);
router.delete('/lessons/:id', requireMentor, LessonController.delete);

// Activity CRUD / એક્ટિવિટી CRUD
router.get('/activities', requireMentor, ActivityController.getAll);
router.get('/activities/:courseId', requireMentor, ActivityController.getByCourseId);
router.post('/activities', requireMentor, ActivityController.create);
router.put('/activities/:id', requireMentor, ActivityController.update);
router.delete('/activities/:id', requireMentor, ActivityController.delete);

// ===== Upload Routes (Mentor + Admin) / અપલોડ રાઉટ્સ (Mentor + Admin) =====
// S3 presigned URL ane file delete / S3 presigned URL and file delete
router.post('/uploads/presigned-url', requireMentor, validateBody(fileUploadSchema), UploadController.getPresignedUrl);
router.delete('/uploads/:key', requireMentor, UploadController.deleteFile);

// ===== Enrollment Stats (Admin Only) / એનરોલમેન્ટ આંકડા (Admin Only) =====
// Enrollment statistics kadho / Get enrollment statistics
router.get('/enrollments/stats', requireAdmin, EnrollmentController.getStats);

export default router;
