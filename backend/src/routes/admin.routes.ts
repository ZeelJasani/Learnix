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
import { validateBody } from '../middleware/validate';
import { createCourseSchema, updateCourseSchema } from '../validations/course.validation';
import { createChapterSchema, reorderChaptersSchema } from '../validations/chapter.validation';
import { createLessonSchema, reorderLessonsSchema } from '../validations/lesson.validation';
import { createActivitySchema, updateActivitySchema } from '../validations/activity.validation';
import { fileUploadSchema } from '../validations/upload.validation';

const router = Router();

// All admin routes require authentication and admin role
router.use(verifyClerkToken);
router.use(requireUser);
router.use(requireAdmin);

// Dashboard
router.get('/dashboard/stats', AdminController.getDashboardStats);
router.get('/dashboard/users', AdminController.getAllUsers);
router.get('/dashboard/enrollments', AdminController.getEnrollmentStats);
router.get('/dashboard/recent-courses', AdminController.getRecentCourses);

// Users
router.get('/users', UserController.getAllUsers);

// Courses
router.get('/courses', CourseController.getAll);
router.get('/courses/:id', CourseController.getById);
router.post('/courses', validateBody(createCourseSchema), CourseController.create);
router.put('/courses/:id', validateBody(updateCourseSchema), CourseController.update);
router.delete('/courses/:id', CourseController.delete);

// Chapters
router.get('/chapters/:courseId', ChapterController.getByCourseId);
router.post('/chapters', validateBody(createChapterSchema), ChapterController.create);
router.put('/chapters/:id', ChapterController.update);
router.delete('/chapters/:id', ChapterController.delete);
router.put('/chapters/reorder', validateBody(reorderChaptersSchema), ChapterController.reorder);

// Lessons
router.get('/lessons/:chapterId', LessonController.getByChapterId);
router.post('/lessons', validateBody(createLessonSchema), LessonController.create);
router.put('/lessons/:id', LessonController.update);
router.delete('/lessons/:id', LessonController.delete);
router.put('/lessons/reorder', validateBody(reorderLessonsSchema), LessonController.reorder);

// Activities
router.get('/activities/:courseId', ActivityController.getByCourseId);
router.post('/activities', validateBody(createActivitySchema), ActivityController.create);
router.put('/activities/:id', validateBody(updateActivitySchema), ActivityController.update);
router.delete('/activities/:id', ActivityController.delete);

// Uploads
router.post('/uploads/presigned-url', validateBody(fileUploadSchema), UploadController.getPresignedUrl);
router.delete('/uploads/:key', UploadController.deleteFile);

// Enrollments
router.get('/enrollments/stats', EnrollmentController.getStats);

export default router;
