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

// All routes require authentication
router.use(verifyClerkToken);
router.use(requireUser);

// Dashboard - Admin only
router.get('/dashboard/stats', requireAdmin, AdminController.getDashboardStats);
router.get('/dashboard/users', requireAdmin, AdminController.getAllUsers);
router.get('/dashboard/enrollments', requireAdmin, AdminController.getEnrollmentStats);
router.get('/dashboard/recent-courses', requireAdmin, AdminController.getRecentCourses);

// Users - Admin only
router.get('/users', requireAdmin, UserController.getAllUsers);

// Mentors - Admin only (listing all mentors)
router.get('/mentors', requireAdmin, AdminController.getAllMentors);

// --- Course Management (Admin OR Mentor) ---

// Courses
router.get('/courses', requireMentor, CourseController.getAll);
router.get('/courses/:id', requireMentor, CourseController.getById);
router.post('/courses', requireMentor, validateBody(createCourseSchema), CourseController.create);
router.put('/courses/:id', requireMentor, validateBody(updateCourseSchema), CourseController.update);
router.delete('/courses/:id', requireMentor, CourseController.delete);

// Chapters
router.get('/chapters/:courseId', requireMentor, ChapterController.getByCourseId);
router.post('/chapters', requireMentor, ChapterController.create);
router.put('/chapters/reorder', requireMentor, ChapterController.reorder);
router.put('/chapters/:id', requireMentor, ChapterController.update);
router.delete('/chapters/:id', requireMentor, ChapterController.delete);

// Lessons
router.get('/lessons/:chapterId', requireMentor, LessonController.getByChapterId);
router.post('/lessons', requireMentor, LessonController.create);
router.put('/lessons/reorder', requireMentor, LessonController.reorder);
router.put('/lessons/:id', requireMentor, LessonController.update);
router.delete('/lessons/:id', requireMentor, LessonController.delete);

// Activities
router.get('/activities/:courseId', requireMentor, ActivityController.getByCourseId);
router.post('/activities', requireMentor, ActivityController.create);
router.put('/activities/:id', requireMentor, ActivityController.update);
router.delete('/activities/:id', requireMentor, ActivityController.delete);

// Uploads
router.post('/uploads/presigned-url', requireMentor, validateBody(fileUploadSchema), UploadController.getPresignedUrl);
router.delete('/uploads/:key', requireMentor, UploadController.deleteFile);

// Enrollments Stats (kept as admin for now, or move to mentor dashboard?)
// Actually EnrollmentController.getStats seems to be general stats. Let's keep it admin for now or check usage.
router.get('/enrollments/stats', requireAdmin, EnrollmentController.getStats);

export default router;
