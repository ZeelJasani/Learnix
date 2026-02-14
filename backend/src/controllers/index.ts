/**
 * Controllers Index / Controllers Index
 *
 * Badha controllers ek jagya thi export kare chhe.
 * Exports all controllers from a single location.
 *
 * Aa barrel export pattern vaparay chhe clean imports mate.
 * This barrel export pattern is used for clean imports.
 */

// User controller - user profile, sync, role management
export { UserController } from './user.controller';

// Course controller - course CRUD, listing, search
export { CourseController } from './course.controller';

// Chapter controller - course chapter management
export { ChapterController } from './chapter.controller';

// Lesson controller - lesson CRUD within chapters
export { LessonController } from './lesson.controller';

// Enrollment controller - student enrollment/unenrollment
export { EnrollmentController } from './enrollment.controller';

// Progress controller - lesson/course progress tracking
export { ProgressController } from './progress.controller';

// Admin controller - admin dashboard, user management
export { AdminController } from './admin.controller';

// Activity controller - learning activities management
export { ActivityController } from './activity.controller';

// Upload controller - file upload to S3/R2
export { UploadController } from './upload.controller';

// Webhook controller - Clerk ane Stripe webhook handlers
// Webhook controller - Clerk and Stripe webhook handlers
export { WebhookController } from './webhook.controller';
