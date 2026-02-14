# Software Requirements Specification (SRS)

## Learnix — Learning Management System

**Version:** 1.0  
**Date:** February 2026  
**Authors:** Learnix Development Team

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [System Features & Functional Requirements](#3-system-features--functional-requirements)
4. [Non-Functional Requirements](#4-non-functional-requirements)
5. [Use Cases](#5-use-cases)
6. [Data Requirements](#6-data-requirements)
7. [External Interface Requirements](#7-external-interface-requirements)
8. [Constraints & Assumptions](#8-constraints--assumptions)

---

## 1. Introduction

### 1.1 Purpose

This document provides a complete Software Requirements Specification for the **Learnix Learning Management System (LMS)**. It describes the functional requirements, non-functional requirements, use cases, data models, and external integrations of the platform.

The intended audience includes developers, testers, project managers, and stakeholders who need a comprehensive understanding of the system.

### 1.2 Scope

Learnix is a full-stack web-based LMS that enables:

- **Students** to discover, enroll in, and learn from structured video courses
- **Mentors (Instructors)** to create, manage, and deliver courses with quizzes, assignments, and live sessions
- **Admins** to manage the entire platform including users, courses, and analytics

The system covers the complete learning lifecycle: course creation → enrollment → lesson consumption → progress tracking → assessments → live interaction → certification milestones.

### 1.3 Definitions & Abbreviations

| Term | Definition |
|---|---|
| LMS | Learning Management System |
| RBAC | Role-Based Access Control |
| JWT | JSON Web Token |
| SSO | Single Sign-On |
| RSC | React Server Components |
| ODM | Object-Document Mapper (Mongoose) |
| CRUD | Create, Read, Update, Delete |
| SDK | Software Development Kit |
| WebRTC | Web Real-Time Communication |
| S3 | Simple Storage Service (AWS/Cloudflare R2) |

### 1.4 Technology Stack Summary

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), React 18, TypeScript, Tailwind CSS 4, shadcn/ui, Radix UI |
| Backend | Node.js (≥18), Express.js 4, TypeScript, Zod validation |
| Database | MongoDB (Atlas) with Mongoose 8 ODM |
| Authentication | Clerk (OAuth + Email/Password) |
| Payments | Stripe (Checkout Sessions + Webhooks) |
| File Storage | AWS S3 / Cloudflare R2 |
| Live Video | Stream.io Video SDK (WebRTC) |
| Security | Arcjet (rate limiting, bot protection), Helmet.js |
| Logging | Winston (structured logging) |

---

## 2. Overall Description

### 2.1 Product Perspective

Learnix is a standalone, self-hosted LMS platform. It is not a plug-in for any existing system. The platform integrates with several third-party services:

```
┌──────────────────────────────────────────────────┐
│                  Learnix Platform                 │
│  ┌──────────┐  ┌──────────┐  ┌────────────────┐  │
│  │ Frontend │  │ Backend  │  │   MongoDB      │  │
│  │ (Next.js)│←→│(Express) │←→│  (Atlas)       │  │
│  └──────────┘  └──────────┘  └────────────────┘  │
└──────────────────────────────────────────────────┘
        │              │              │
   ┌────┴───┐    ┌─────┴────┐   ┌────┴─────┐
   │ Clerk  │    │ Stripe   │   │Stream.io │
   │ (Auth) │    │(Payments)│   │ (Video)  │
   └────────┘    └──────────┘   └──────────┘
        │
   ┌────┴─────┐
   │ AWS S3 / │
   │   R2     │
   └──────────┘
```

### 2.2 User Classes

| User Class | Description | Access Level |
|---|---|---|
| **Guest** | Unauthenticated visitor | Browse courses, view about page |
| **Student (User)** | Registered user with default role | Enroll in courses, learn, take quizzes, join live sessions |
| **Mentor** | Instructor with elevated privileges | Create/manage courses, host live sessions, grade assignments |
| **Admin** | Platform administrator | Full access — manage users, all courses, analytics, role assignments |

### 2.3 Operating Environment

- **Client**: Modern web browsers (Chrome, Firefox, Safari, Edge — latest 2 versions)
- **Server**: Node.js ≥18.0 runtime
- **Database**: MongoDB 6.x+ (via MongoDB Atlas recommended)
- **Hosting**: Vercel (frontend), any Node.js host (backend)
- **Minimum Screen Resolution**: 320px (mobile-first responsive design)

### 2.4 Design Constraints

1. Frontend must use Next.js App Router with Server Components
2. Backend uses REST APIs only (Express.js)
3. All user input must be validated with Zod schemas on the backend
4. Authentication delegated entirely to Clerk — no custom password storage
5. Payment processing delegated to Stripe — no card data handled on-server
6. File storage uses S3-compatible API — no local disk storage for media
7. Comments must be bilingual (Gujarati + English) on all business logic

---

## 3. System Features & Functional Requirements

### 3.1 Authentication & User Management

| ID | Requirement | Priority |
|---|---|---|
| FR-AUTH-01 | Users can register using email/password, Google OAuth, or GitHub OAuth via Clerk | High |
| FR-AUTH-02 | Users can sign in and sign out with session persistence | High |
| FR-AUTH-03 | New users are automatically synced to MongoDB (`/users/sync`) on first login | High |
| FR-AUTH-04 | JWT tokens are verified on every authenticated backend request | High |
| FR-AUTH-05 | Three roles exist: User (default), Mentor, Admin — set by Admin only | High |
| FR-AUTH-06 | Admins can assign/change user roles via the admin panel | High |
| FR-AUTH-07 | Admins can ban/unban users (banned users cannot access the platform) | Medium |
| FR-AUTH-08 | User profile includes name, email, avatar (from Clerk), and optional metadata | Medium |

### 3.2 Course Management

| ID | Requirement | Priority |
|---|---|---|
| FR-CRS-01 | Mentors can create courses with title, description, category, level, price, and thumbnail | High |
| FR-CRS-02 | Courses have a URL-friendly slug auto-generated from the title | High |
| FR-CRS-03 | Courses can be in "draft" or "published" status — only published courses are visible to students | High |
| FR-CRS-04 | Courses contain ordered **chapters**, and chapters contain ordered **lessons** | High |
| FR-CRS-05 | Mentors can reorder chapters and lessons via drag-and-drop (dnd-kit) | Medium |
| FR-CRS-06 | Admins can edit, delete, or publish/unpublish any course | High |
| FR-CRS-07 | Courses display category, level (beginner/intermediate/advanced), duration, and price | Medium |
| FR-CRS-08 | Paid courses have auto-created Stripe price IDs for checkout | High |
| FR-CRS-09 | Course descriptions support rich text formatting (bold, italic, lists, headings, alignment) via TipTap editor | Medium |
| FR-CRS-10 | All users can search courses by keyword with debounced real-time search | Medium |

### 3.3 Lesson System

| ID | Requirement | Priority |
|---|---|---|
| FR-LES-01 | Lessons contain a title, description, video (S3 URL), and optional thumbnail (S3 URL) | High |
| FR-LES-02 | Videos are uploaded to AWS S3 / Cloudflare R2 via presigned URLs | High |
| FR-LES-03 | Lesson content is accessible only to enrolled students | High |
| FR-LES-04 | Students can mark lessons as complete (toggleable) | High |
| FR-LES-05 | Lesson completion records are persisted in `LessonProgress` collection | High |

### 3.4 Enrollment & Payment

| ID | Requirement | Priority |
|---|---|---|
| FR-ENR-01 | Students can enroll in free courses instantly (no payment required) | High |
| FR-ENR-02 | Paid courses redirect to Stripe Checkout for payment | High |
| FR-ENR-03 | Successful payment triggers enrollment via Stripe webhook (`checkout.session.completed`) | High |
| FR-ENR-04 | Students can view their enrolled courses on the dashboard | High |
| FR-ENR-05 | Enrollment status is checked before granting access to course content | High |
| FR-ENR-06 | Duplicate enrollment is prevented (unique compound index: userId + courseId) | High |
| FR-ENR-07 | Stripe customer ID is created/stored for users on first payment | Medium |

### 3.5 Progress Tracking

| ID | Requirement | Priority |
|---|---|---|
| FR-PRG-01 | Per-lesson completion is tracked as boolean (completed/not completed) | High |
| FR-PRG-02 | Course-level progress is calculated as: `(completed lessons / total lessons) × 100` | High |
| FR-PRG-03 | Progress dashboard displays circular SVG progress charts per course | Medium |
| FR-PRG-04 | Milestone badges are awarded at 25%, 50%, 75%, and 100% completion | Medium |
| FR-PRG-05 | Detailed progress view shows per-chapter lesson completion breakdown | Medium |
| FR-PRG-06 | Confetti animation triggers on 100% course completion | Low |

### 3.6 Quiz System

| ID | Requirement | Priority |
|---|---|---|
| FR-QZ-01 | Mentors can create quizzes per course with title, description, and multiple questions | High |
| FR-QZ-02 | Quiz questions support multiple-choice format with 2–6 options | High |
| FR-QZ-03 | Quizzes have configurable: passing score (%), time limit (minutes), max attempts | High |
| FR-QZ-04 | Question order can be shuffled per attempt (`shuffleQuestions` flag) | Medium |
| FR-QZ-05 | Eligibility check prevents students from exceeding max attempt count | High |
| FR-QZ-06 | Quiz timer counts down from the configured time limit | Medium |
| FR-QZ-07 | Submissions are auto-graded: score = correct answers / total questions × 100 | High |
| FR-QZ-08 | Pass/fail is determined by comparing score to `passingScore` threshold | High |
| FR-QZ-09 | Students can review attempt history with question-level results (selected vs. correct) | Medium |
| FR-QZ-10 | Confetti animation on quiz pass | Low |

### 3.7 Assignment & Peer Review

| ID | Requirement | Priority |
|---|---|---|
| FR-ASG-01 | Mentors can create assignments per course with title, description, rubric, and due dates | High |
| FR-ASG-02 | Students can submit assignments with text content and/or file uploads | High |
| FR-ASG-03 | Submissions are tracked with status (pending/graded) and grade | High |
| FR-ASG-04 | Students can submit peer reviews for other students' submissions | Medium |
| FR-ASG-05 | Peer reviews include feedback text and numeric rating | Medium |

### 3.8 Activity System

| ID | Requirement | Priority |
|---|---|---|
| FR-ACT-01 | Admins/Mentors can create course-specific activities with title, description, type, and due dates | High |
| FR-ACT-02 | Students can view their activities sorted by due date | Medium |
| FR-ACT-03 | Students can mark activities as complete | Medium |
| FR-ACT-04 | Activity completion is persisted in `ActivityCompletion` collection | Medium |

### 3.9 Live Sessions (Stream.io)

| ID | Requirement | Priority |
|---|---|---|
| FR-LIV-01 | Mentors can schedule live sessions for a course with title, description, date/time, and duration | High |
| FR-LIV-02 | Session creation auto-creates a Stream.io video call/channel | High |
| FR-LIV-03 | Enrolled students can join live sessions via the frontend meeting page | High |
| FR-LIV-04 | Joining generates a per-user Stream.io token for video participation | High |
| FR-LIV-05 | Meeting setup page shows video preview and mic/cam toggles before joining | Medium |
| FR-LIV-06 | Meeting room supports 3 layout modes: Speaker, Grid, and Paginated Grid | Medium |
| FR-LIV-07 | Participant list sidebar is available during the session | Medium |
| FR-LIV-08 | Mentors can start sessions (status → "live") and end sessions (status → "ended") | High |
| FR-LIV-09 | Sessions follow lifecycle: Scheduled → Live → Ended / Cancelled | High |
| FR-LIV-10 | Sessions have a 10-minute join window before the scheduled start time | Medium |
| FR-LIV-11 | Session access requires course enrollment verification | High |

### 3.10 Admin Panel

| ID | Requirement | Priority |
|---|---|---|
| FR-ADM-01 | Admin dashboard shows platform-wide statistics (users, courses, enrollments, revenue) | High |
| FR-ADM-02 | Admin can view all users with search, paginate, and filter | High |
| FR-ADM-03 | Admin can change user roles (User ↔ Mentor ↔ Admin) | High |
| FR-ADM-04 | Admin can ban/unban users | Medium |
| FR-ADM-05 | Admin can view and manage all courses (including drafts) | High |
| FR-ADM-06 | Admin can delete courses completely | High |
| FR-ADM-07 | Admin analytics page displays Recharts/Tremor visualizations with monthly filters | Medium |

### 3.11 Mentor Panel

| ID | Requirement | Priority |
|---|---|---|
| FR-MNT-01 | Mentors have access to a dedicated mentor dashboard | High |
| FR-MNT-02 | Mentors can view only their own courses | High |
| FR-MNT-03 | Mentors can create/edit/delete their own courses, chapters, and lessons | High |
| FR-MNT-04 | Mentors can create quizzes and activities for their courses | High |
| FR-MNT-05 | Mentors can host live sessions for enrolled students | High |
| FR-MNT-06 | Mentors can view enrolled students and their progress | Medium |

### 3.12 Search & Discovery

| ID | Requirement | Priority |
|---|---|---|
| FR-SRC-01 | Public course listing page shows all published courses | High |
| FR-SRC-02 | Search modal with debounced input returns matching courses | Medium |
| FR-SRC-03 | Course cards display title, thumbnail, price, level, category, and enrollment count | Medium |
| FR-SRC-04 | Course detail page shows full information with enrollment button | High |

---

## 4. Non-Functional Requirements

### 4.1 Performance

| ID | Requirement | Target |
|---|---|---|
| NFR-P01 | Page initial load (First Contentful Paint) | < 1.5 seconds |
| NFR-P02 | API response time for simple queries | < 200ms |
| NFR-P03 | Video streaming start time | < 3 seconds |
| NFR-P04 | Search autocomplete latency | < 300ms |
| NFR-P05 | Database reads use `.lean()` for optimized query performance | Enforced |
| NFR-P06 | Frontend uses Turbopack for near-instant HMR in development | Enforced |

### 4.2 Security

| ID | Requirement | Target |
|---|---|---|
| NFR-S01 | All API endpoints require JWT verification (except public routes) | Enforced |
| NFR-S02 | Role-based middleware guards all protected routes | Enforced |
| NFR-S03 | Input validation via Zod on all POST/PUT request bodies | Enforced |
| NFR-S04 | Rate limiting on all API endpoints | Enforced (Arcjet + express-rate-limit) |
| NFR-S05 | Security headers (CSP, HSTS, X-Frame-Options) enabled via Helmet | Enforced |
| NFR-S06 | Webhook signatures are verified (Clerk via Svix, Stripe via stripe signature) | Enforced |
| NFR-S07 | Sensitive data stored in environment variables only (`.env` excluded from VCS) | Enforced |
| NFR-S08 | No direct SQL/NoSQL injection — all queries use Mongoose ODM parameterized methods | Enforced |
| NFR-S09 | Bot protection via Arcjet Shield on sensitive frontend routes | Enforced |

### 4.3 Reliability & Availability

| ID | Requirement | Target |
|---|---|---|
| NFR-R01 | MongoDB Atlas provides 99.995% uptime SLA | Expected |
| NFR-R02 | Application gracefully handles database connection failures | Implemented |
| NFR-R03 | Error handling returns standardized JSON error responses | Implemented |
| NFR-R04 | Winston logger provides structured error logs for debugging | Implemented |
| NFR-R05 | Frontend shows fallback/error UI on API failures (LiveCallAlert, toast errors) | Implemented |

### 4.4 Scalability

| ID | Requirement | Target |
|---|---|---|
| NFR-SC01 | Frontend can be deployed as serverless (Vercel, Netlify) | Supported |
| NFR-SC02 | Backend can be horizontally scaled (stateless Express server) | Supported |
| NFR-SC03 | MongoDB Atlas supports auto-scaling with sharding | Supported |
| NFR-SC04 | File storage (S3/R2) scales independently | Supported |

### 4.5 Usability

| ID | Requirement | Target |
|---|---|---|
| NFR-U01 | Responsive design — mobile (320px), tablet (768px), desktop (1024px+) | Enforced |
| NFR-U02 | Dark mode and light mode with persistent preference (next-themes) | Implemented |
| NFR-U03 | Keyboard navigation support on all interactive elements | Partial |
| NFR-U04 | Loading states with skeleton loaders and spinners | Implemented |
| NFR-U05 | Toast notifications for success/error feedback (Sonner) | Implemented |

### 4.6 Maintainability

| ID | Requirement | Target |
|---|---|---|
| NFR-M01 | Bilingual comments (Gujarati + English) on all business logic | Enforced |
| NFR-M02 | Separation of concerns: Routes → Controllers → Services → Models | Enforced |
| NFR-M03 | TypeScript strict mode for compile-time type safety | Enforced |
| NFR-M04 | Zod schemas centralized in `validations/` directory | Enforced |
| NFR-M05 | Standardized API responses via `ApiResponse` utility | Enforced |

---

## 5. Use Cases

### UC-01: Student Course Discovery & Enrollment

**Actor:** Student (or Guest → Student)  
**Precondition:** None (browsing) or Authenticated (enrollment)

| Step | Action |
|---|---|
| 1 | Guest visits the homepage and views featured courses |
| 2 | Guest browses `/courses` page with category/level filters |
| 3 | Guest clicks a course card → views course detail page |
| 4 | If not signed in → redirected to Clerk login page |
| 5 | If course is free → enrolls instantly via `/enrollments` API |
| 6 | If course is paid → redirected to Stripe Checkout session |
| 7 | After successful payment → Stripe webhook creates enrollment |
| 8 | Student is redirected to the payment success page |
| 9 | Student accesses the course on the dashboard |

### UC-02: Student Learning Journey

**Actor:** Student  
**Precondition:** Enrolled in a course

| Step | Action |
|---|---|
| 1 | Student opens dashboard → sees enrolled courses with progress |
| 2 | Student clicks a course → enters the 5-tab dashboard (Overview, Lessons, Live, Progress, Quizzes) |
| 3 | Student selects a lesson → watches video content |
| 4 | Student marks the lesson as complete → progress updates |
| 5 | Student views overall progress → sees circular chart with milestone badges |
| 6 | Student takes a quiz → answers questions within time limit |
| 7 | Quiz is auto-graded → student sees score, pass/fail, and review |
| 8 | Student joins scheduled live session → participates in live meeting |
| 9 | Upon reaching 100% → confetti celebration |

### UC-03: Mentor Course Creation

**Actor:** Mentor  
**Precondition:** User has Mentor role assigned by Admin

| Step | Action |
|---|---|
| 1 | Mentor accesses mentor dashboard → clicks "Create Course" |
| 2 | Fills in course details (title, description, category, level, price, thumbnail) |
| 3 | Course is created in "draft" status |
| 4 | Mentor adds chapters → adds lessons to chapters |
| 5 | Uploads lesson videos to S3 via presigned URL flow |
| 6 | Reorders chapters/lessons via drag-and-drop |
| 7 | Creates quizzes with questions, passing score, time limit |
| 8 | Creates activities with due dates |
| 9 | Publishes the course (status → "published") |
| 10 | Course appears on the public course listing |

### UC-04: Mentor Hosts Live Session

**Actor:** Mentor  
**Precondition:** Mentor owns a published course with enrolled students

| Step | Action |
|---|---|
| 1 | Mentor navigates to course → schedules a live session (title, date, duration) |
| 2 | Backend creates a Stream.io video call/channel |
| 3 | At the scheduled time, mentor starts the session (status → "live") |
| 4 | Enrolled students join via the live session page (device setup → meeting room) |
| 5 | Meeting runs with video, audio, participant list, layout switching |
| 6 | Mentor ends the session → status → "ended", Stream call ends |

### UC-05: Admin User Management

**Actor:** Admin  
**Precondition:** User has Admin role

| Step | Action |
|---|---|
| 1 | Admin navigates to `/admin/users` |
| 2 | Views paginated list of all users with search |
| 3 | Selects a user → changes their role (User ↔ Mentor ↔ Admin) |
| 4 | Alternatively, bans a user (blocks platform access) |
| 5 | Views analytics dashboard with user growth, enrollment trends, revenue |

### UC-06: Student Takes Quiz

**Actor:** Student  
**Precondition:** Enrolled in course, quiz exists, eligible (attempts < maxAttempts)

| Step | Action |
|---|---|
| 1 | Student navigates to course quizzes tab |
| 2 | Clicks "Take Quiz" → eligibility check passes |
| 3 | Quiz page loads with questions (optionally shuffled) and timer |
| 4 | Student selects answers for each question |
| 5 | Student submits quiz before timer expires |
| 6 | Backend auto-grades: calculates score, determines pass/fail |
| 7 | Results page shows score, pass/fail, and per-question review |
| 8 | Confetti on pass; student can retry if attempts remain |

---

## 6. Data Requirements

### 6.1 Entity Summary

| Entity | Collection | Records | Key Fields |
|---|---|---|---|
| User | `users` | Unique per Clerk user | clerkId (unique), email, name, role, banned |
| Course | `courses` | Created by mentors | title, slug (unique), status, price, userId (FK) |
| Chapter | `chapters` | Belongs to course | title, position, courseId (FK) |
| Lesson | `lessons` | Belongs to chapter | title, videoKey (S3), position, chapterId (FK) |
| Enrollment | `enrollments` | Student ↔ Course link | userId, courseId (compound unique), status, amount |
| LessonProgress | `lessonprogresses` | Per-lesson per-student | userId, lessonId, completed, completedAt |
| Activity | `activities` | Course-specific tasks | title, type, dueDate, courseId (FK) |
| ActivityCompletion | `activitycompletions` | Per-activity per-student | userId, activityId, completedAt |
| Quiz | `quizzes` | Course quizzes | title, passingScore, timeLimit, maxAttempts, questions[] |
| QuizAttempt | `quizattempts` | Student quiz submissions | userId, quizId, answers[], score, passed |
| LiveSession | `livesessions` | Stream.io sessions | title, streamCallId (unique), status, hostClerkId |
| Submission | `submissions` | Assignment submissions | userId, assignmentId, content, fileUrl, grade |
| PeerReview | `peerreviews` | Review of submissions | reviewerId, submissionId, feedback, rating |

### 6.2 Key Indexes

| Collection | Index | Type | Purpose |
|---|---|---|---|
| users | clerkId | Unique | Fast lookup by Clerk authentication ID |
| users | email | Unique | Prevent duplicate accounts |
| courses | slug | Unique | URL-friendly course access |
| enrollments | userId + courseId | Compound Unique | Prevent duplicate enrollments |
| lessonprogresses | userId + lessonId | Compound Unique | One record per student per lesson |
| livesessions | streamCallId | Unique | Map Stream.io calls to sessions |

---

## 7. External Interface Requirements

### 7.1 Clerk Authentication

| Aspect | Detail |
|---|---|
| **Integration** | Clerk Next.js SDK (frontend) + Clerk Node SDK (backend) |
| **Auth Methods** | Email/Password, Google OAuth, GitHub OAuth |
| **Token Flow** | Clerk issues JWT → Frontend includes in Authorization header → Backend verifies via `verifyClerkToken` middleware |
| **Webhooks** | `user.created`, `user.updated`, `user.deleted` events sync user data to MongoDB |

### 7.2 Stripe Payments

| Aspect | Detail |
|---|---|
| **Integration** | Stripe Node SDK (backend) + Stripe JS (frontend) |
| **Payment Flow** | Create Checkout Session → Redirect to Stripe → Webhook confirms → Create Enrollment |
| **Webhook Event** | `checkout.session.completed` triggers enrollment creation |
| **Price Management** | Stripe Price IDs auto-created when course price is set |
| **Customer Management** | Stripe Customer ID stored in User record for recurring identification |

### 7.3 AWS S3 / Cloudflare R2

| Aspect | Detail |
|---|---|
| **Integration** | AWS SDK v3 (`@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`) |
| **Upload Flow** | Frontend requests presigned URL → Frontend uploads directly to S3 → Key stored in DB |
| **File Types** | Video files (lessons), image files (thumbnails, course images) |
| **Bucket** | Single bucket with path-based organization |

### 7.4 Stream.io Video

| Aspect | Detail |
|---|---|
| **Integration** | Stream.io Node SDK (backend) + Stream Video React SDK (frontend) |
| **Call Creation** | Backend creates Stream call when mentor schedules a live session |
| **Token Generation** | Backend generates per-user Stream tokens on join request |
| **Call Types** | `default` type for video meetings |
| **Frontend SDK** | StreamVideoClient, StreamCall, StreamTheme, CallControls, SpeakerLayout, PaginatedGridLayout |

---

## 8. Constraints & Assumptions

### 8.1 Constraints

1. **Authentication is Clerk-only** — no custom auth implementation is supported
2. **Payments are Stripe-only** — no PayPal, Razorpay, or other processors
3. **Backend uses REST only** — no GraphQL endpoints despite the project rules referencing it
4. **File storage requires S3-compatible service** — local file storage is not supported
5. **Live sessions require Stream.io** — no alternative WebRTC provider supported
6. **MongoDB is the only supported database** — no SQL database support
7. **Single-language courses** — no multi-language course content support currently

### 8.2 Assumptions

1. All users have stable internet connections for video lessons and live sessions
2. MongoDB Atlas is used for production with adequate cluster capacity
3. Clerk free tier is sufficient for development; production may require paid plan
4. Stream.io free tier supports limited concurrent live sessions
5. AWS S3 / Cloudflare R2 bucket is pre-configured with proper CORS settings
6. Admin users are seeded via `ADMIN_EMAILS` environment variable
7. HTTPS is enforced in production environment

### 8.3 Future Enhancements (Out of Scope for v1.0)

1. Certificate generation upon course completion
2. Discussion forums per course
3. Real-time chat during live sessions (non-video text chat)
4. Course reviews and ratings system
5. Instructor revenue sharing (Stripe Connect)
6. Multi-language UI localization
7. Mobile native app (React Native)
8. Email notification service for due dates, enrollments
9. Learning path recommendations (AI-based)
10. Bulk student import/export (CSV)

---

*End of Software Requirements Specification*
