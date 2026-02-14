/**
 * Models Index / Models Index
 *
 * Badha Mongoose models ane interfaces ek jagya thi export kare chhe.
 * Exports all Mongoose models and interfaces from a single location.
 *
 * Aa barrel export pattern vaparay chhe import simplify karvaa mate.
 * This barrel export pattern is used to simplify imports.
 *
 * Example / Example:
 * import { User, Course, Enrollment } from '../models';
 */

// User model ane interface / User model and interface
export { User, IUser } from './User';

// Course model, interface, ane enums / Course model, interface, and enums
export { Course, ICourse, CourseLevel, CourseStatus } from './Course';

// Chapter model ane interface / Chapter model and interface
export { Chapter, IChapter } from './Chapter';

// Lesson model ane interface / Lesson model and interface
export { Lesson, ILesson } from './Lesson';

// Enrollment model, interface, ane status enum / Enrollment model, interface, and status enum
export { Enrollment, IEnrollment, EnrollmentStatus } from './Enrollment';

// Lesson progress tracking / Lesson progress tracking
export { LessonProgress, ILessonProgress } from './LessonProgress';

// Activity (assignments, exercises) / Activity (assignments, exercises)
export { Activity, IActivity, ActivityType } from './Activity';

// Activity completion tracking / Activity completion tracking
export { ActivityCompletion, IActivityCompletion } from './ActivityCompletion';

// Quiz model, questions, ane types / Quiz model, questions, and types
export { Quiz, IQuiz, IQuestion, QuestionType } from './Quiz';

// Quiz attempt tracking / Quiz attempt tracking
export { QuizAttempt, IQuizAttempt, IQuestionResult } from './QuizAttempt';
