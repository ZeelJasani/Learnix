# Learnix — Application Workflow Document

**Version:** 1.0  
**Date:** February 2026

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Authentication Workflows](#2-authentication-workflows)
3. [Student Workflows](#3-student-workflows)
4. [Mentor Workflows](#4-mentor-workflows)
5. [Admin Workflows](#5-admin-workflows)
6. [Payment Workflows](#6-payment-workflows)
7. [Live Session Workflows](#7-live-session-workflows)
8. [File Upload Workflows](#8-file-upload-workflows)
9. [Webhook Workflows](#9-webhook-workflows)
10. [Development Workflow](#10-development-workflow)

---

## 1. System Overview

### Request Lifecycle

```
Browser → Next.js Frontend → REST API → Express Backend → MongoDB
                ↕                            ↕
            Clerk Auth                 Stripe / S3 / Stream.io
```

### Role Hierarchy

```
Guest (unauthenticated)
  └── User (default role — students)
        └── Mentor (instructors — can create courses)
              └── Admin (full platform control)
```

---

## 2. Authentication Workflows

### 2.1 User Registration

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (Next.js)
    participant C as Clerk
    participant B as Backend (Express)
    participant DB as MongoDB

    U->>F: Click Sign Up
    F->>C: Open Clerk sign-up form
    U->>C: Enter email/password or OAuth (Google/GitHub)
    C->>C: Create Clerk user
    C-->>F: Return session + JWT
    F->>B: POST /api/users/sync (JWT)
    B->>B: verifyClerkToken middleware
    B->>DB: Find or Create user (clerkId, email, name)
    DB-->>B: User document
    B-->>F: User profile response
    F->>F: Redirect to /dashboard
```

### 2.2 User Login

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant C as Clerk
    participant B as Backend

    U->>F: Click Sign In
    F->>C: Open Clerk sign-in form
    U->>C: Enter credentials
    C->>C: Verify credentials
    C-->>F: Session + JWT
    F->>B: POST /api/users/sync (JWT)
    B->>B: Verify token, sync user to DB
    B-->>F: User profile with role
    F->>F: Redirect based on role (dashboard / admin / mentor)
```

### 2.3 Protected Route Access

```mermaid
flowchart TD
    A[User visits protected page] --> B{Has Clerk session?}
    B -->|No| C[Redirect to /login]
    B -->|Yes| D[Frontend sends request with JWT]
    D --> E{verifyClerkToken}
    E -->|Invalid| F[401 Unauthorized]
    E -->|Valid| G{requireUser — user in DB?}
    G -->|No| H[403 User not found]
    G -->|Yes| I{Route requires special role?}
    I -->|No| J[✅ Proceed to controller]
    I -->|Mentor required| K{user.role is mentor/admin?}
    I -->|Admin required| L{user.role is admin?}
    K -->|No| M[403 Insufficient role]
    K -->|Yes| J
    L -->|No| M
    L -->|Yes| J
```

---

## 3. Student Workflows

### 3.1 Course Discovery & Enrollment

```mermaid
flowchart TD
    A[Browse /courses page] --> B[View published courses]
    B --> C[Search / filter courses]
    C --> D[Click course card]
    D --> E[View course detail page]
    E --> F{User authenticated?}
    F -->|No| G[Redirect to login]
    F -->|Yes| H{Already enrolled?}
    H -->|Yes| I[Show 'Go to Dashboard' button]
    H -->|No| J{Course price = 0?}
    J -->|Free| K[POST /api/enrollments]
    K --> L[Enrollment created instantly]
    J -->|Paid| M[POST /api/courses/slug/actions — create checkout]
    M --> N[Redirect to Stripe Checkout]
    N --> O{Payment successful?}
    O -->|Yes| P[Stripe webhook creates enrollment]
    O -->|No| Q[Redirect to /payment/cancel]
    P --> R[Redirect to /payment/success]
    L --> S[Redirect to course dashboard]
    R --> S
```

### 3.2 Learning & Progress

```mermaid
flowchart TD
    A[Student opens /dashboard] --> B[View enrolled courses with progress %]
    B --> C[Click course → 5-tab interface]
    C --> D{Select tab}
    D -->|Overview| E[View course info, chapters outline]
    D -->|Lessons| F[View chapter list with lessons]
    D -->|Live| G[View scheduled/live sessions]
    D -->|Progress| H[View circular progress chart + badges]
    D -->|Quizzes| I[View available quizzes]

    F --> J[Click lesson → open player]
    J --> K[Watch video]
    K --> L[Click 'Mark Complete']
    L --> M[POST /api/progress/lesson/:id/complete]
    M --> N[LessonProgress record updated]
    N --> O[Progress % recalculated]
    O --> P{Progress = 100%?}
    P -->|Yes| Q[🎉 Confetti celebration + badge]
    P -->|No| R[Continue to next lesson]
```

### 3.3 Quiz Taking

```mermaid
flowchart TD
    A[Student views Quizzes tab] --> B[See quiz list with status]
    B --> C[Click 'Take Quiz']
    C --> D{GET /api/quizzes/:id/can-take}
    D -->|Not eligible — max attempts reached| E[Show 'No attempts remaining']
    D -->|Eligible| F[Navigate to quiz page]
    F --> G[Quiz loads: questions + timer]
    G --> H{shuffleQuestions enabled?}
    H -->|Yes| I[Questions displayed in random order]
    H -->|No| J[Questions displayed in fixed order]
    I --> K[Student answers questions]
    J --> K
    K --> L{Timer expires or student submits?}
    L -->|Submit| M[POST /api/quizzes/:id/submit]
    L -->|Timer up| M
    M --> N[Backend auto-grades answers]
    N --> O[Score calculated: correct/total × 100]
    O --> P{Score ≥ passingScore?}
    P -->|Pass| Q[✅ Passed + 🎉 Confetti]
    P -->|Fail| R[❌ Failed — can retry if attempts remain]
    Q --> S[View detailed results: per-question review]
    R --> S
```

### 3.4 Assignment Submission

```mermaid
flowchart TD
    A[Student views Assignments] --> B[See assignment list with due dates]
    B --> C[Click assignment]
    C --> D[View rubric and requirements]
    D --> E[Write content / upload file]
    E --> F[POST /api/assignments/:id/submit]
    F --> G[Submission created — status: pending]
    G --> H[Wait for grading]
    H --> I{Graded?}
    I -->|Yes| J[View grade and feedback]
    I -->|Peer review assigned| K[Another student reviews]
    K --> L[POST /api/assignments/:id/peer-review]
    L --> M[Feedback and rating saved]
```

---

## 4. Mentor Workflows

### 4.1 Course Creation

```mermaid
flowchart TD
    A[Mentor opens /mentor] --> B[Click 'Create Course']
    B --> C[Fill course form]
    C --> D[Title, Description TipTap, Category, Level, Price]
    D --> E[Upload thumbnail → S3 presigned URL flow]
    E --> F[POST /api/mentor/courses]
    F --> G[Course created — status: draft]
    G --> H[Add chapters: POST /api/mentor/courses/:id/chapters]
    H --> I[Add lessons to chapters: POST /api/mentor/courses/:id/lessons]
    I --> J[Upload lesson videos → S3]
    J --> K[Reorder chapters/lessons via drag-and-drop dnd-kit]
    K --> L[Create quizzes: POST /api/mentor/courses/:id/quizzes]
    L --> M[Create activities: POST /api/mentor/courses/:id/activities]
    M --> N{Ready to publish?}
    N -->|Yes| O[Set status → 'published']
    N -->|No| P[Keep as draft — edit later]
    O --> Q[Course visible on /courses]
```

### 4.2 Quiz Builder

```mermaid
flowchart TD
    A[Mentor opens course edit] --> B[Navigate to Quiz section]
    B --> C[Click 'Create Quiz']
    C --> D[Enter quiz details]
    D --> E[Title, Description]
    E --> F[Set passingScore %, timeLimit minutes, maxAttempts]
    F --> G[Add questions]
    G --> H[Question text + options 2–6 + correct answer]
    H --> I{More questions?}
    I -->|Yes| G
    I -->|No| J[Toggle shuffleQuestions on/off]
    J --> K[Save quiz: POST /api/mentor/courses/:id/quizzes]
    K --> L[Quiz available to enrolled students]
```

### 4.3 Student Monitoring

```mermaid
flowchart TD
    A[Mentor opens /mentor/students] --> B[View enrolled students per course]
    B --> C[See per-student progress %]
    C --> D[View quiz attempt history]
    D --> E[View assignment submissions]
    E --> F[Grade submissions manually if needed]
```

---

## 5. Admin Workflows

### 5.1 User Management

```mermaid
flowchart TD
    A[Admin opens /admin/users] --> B[View all users — paginated table]
    B --> C[Search users by name/email]
    C --> D[Click user row]
    D --> E{Action?}
    E -->|Change role| F[Select new role: User / Mentor / Admin]
    F --> G[PUT /api/admin/users/:id/role]
    G --> H[Role updated in DB + Clerk metadata]
    E -->|Ban user| I[PUT /api/admin/users/:id/ban]
    I --> J[User banned — cannot access platform]
    E -->|Unban user| K[PUT /api/admin/users/:id/ban — toggle]
    K --> L[User access restored]
```

### 5.2 Course Management

```mermaid
flowchart TD
    A[Admin opens /admin/courses] --> B[View ALL courses — drafts + published]
    B --> C[Search / filter courses]
    C --> D[Click course]
    D --> E{Action?}
    E -->|Edit| F[Navigate to edit page — modify any field]
    E -->|Delete| G[Navigate to delete page — confirm deletion]
    E -->|Publish/Unpublish| H[Toggle course status]
    F --> I[PUT /api/admin/courses/:id]
    G --> J[DELETE /api/admin/courses/:id]
    H --> I
```

### 5.3 Analytics Dashboard

```mermaid
flowchart TD
    A[Admin opens /admin/dashboard] --> B[View platform statistics]
    B --> C[Total users, courses, enrollments, revenue]
    C --> D[Monthly enrollment chart — Recharts]
    D --> E[Revenue breakdown — Tremor components]
    E --> F[Apply MonthFilter for time-range analysis]
    F --> G[GET /api/admin/analytics]
    G --> H[Display filtered stats]
```

---

## 6. Payment Workflows

### 6.1 Stripe Checkout Flow

```mermaid
sequenceDiagram
    participant S as Student
    participant F as Frontend
    participant B as Backend
    participant ST as Stripe
    participant DB as MongoDB

    S->>F: Click 'Enroll' on paid course
    F->>B: POST create checkout session
    B->>ST: Create Checkout Session (priceId, customerId, courseId in metadata)
    ST-->>B: Checkout Session URL
    B-->>F: Redirect URL
    F->>ST: Redirect student to Stripe Checkout
    S->>ST: Enter payment details
    ST->>ST: Process payment
    ST-->>S: Redirect to /payment/success
    ST->>B: POST /api/webhooks/stripe (checkout.session.completed)
    B->>B: Verify Stripe signature
    B->>DB: Create Enrollment — userId, courseId, amount
    DB-->>B: Enrollment saved
```

### 6.2 Payment States

```mermaid
stateDiagram-v2
    [*] --> BrowsingCourse
    BrowsingCourse --> CheckoutStarted: Click Enroll
    CheckoutStarted --> StripeCheckout: Redirect to Stripe
    StripeCheckout --> PaymentSuccessful: Payment completed
    StripeCheckout --> PaymentCancelled: User cancels
    PaymentSuccessful --> EnrollmentCreated: Webhook received
    EnrollmentCreated --> CourseAccess: Student accesses course
    PaymentCancelled --> BrowsingCourse: Return to course page
```

---

## 7. Live Session Workflows

### 7.1 Session Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Scheduled: Mentor creates session
    Scheduled --> Live: Mentor starts session
    Scheduled --> Cancelled: Mentor cancels
    Live --> Ended: Mentor ends session
    Cancelled --> [*]
    Ended --> [*]
```

### 7.2 Mentor Creates & Hosts Session

```mermaid
sequenceDiagram
    participant M as Mentor
    participant F as Frontend
    participant B as Backend
    participant Stream as Stream.io
    participant DB as MongoDB

    M->>F: Schedule live session (title, date, duration)
    F->>B: POST /api/live-sessions
    B->>B: requireMentor + requireUser check
    B->>Stream: Create Stream.io call/channel
    Stream-->>B: streamCallId
    B->>DB: Save LiveSession (status: scheduled)
    DB-->>B: Session saved
    B-->>F: Session created

    Note over M,Stream: At scheduled time...

    M->>F: Click 'Start Session'
    F->>B: POST /api/live-sessions/:id/start
    B->>DB: Update status → 'live'
    B-->>F: Session started
    F->>Stream: Join Stream call (mentor as host)

    Note over M,Stream: Session in progress...

    M->>F: Click 'End Call'
    F->>B: POST /api/live-sessions/:id/end
    B->>Stream: End Stream call
    B->>DB: Update status → 'ended', endedAt = now
    B-->>F: Session ended
    F->>F: Redirect to /dashboard
```

### 7.3 Student Joins Session

```mermaid
sequenceDiagram
    participant S as Student
    participant F as Frontend
    participant B as Backend
    participant Stream as Stream.io

    S->>F: Click 'Join' on live session
    F->>B: POST /api/live-sessions/:id/join
    B->>B: Verify enrollment in course
    B->>B: Verify session is 'scheduled' or 'live'
    B->>B: Check 10-min join window
    B->>Stream: Generate user token
    Stream-->>B: Stream.io token
    B-->>F: Token + session data
    F->>F: Initialize StreamVideoClient
    F->>F: Show MeetingSetup (video preview, mic/cam)
    S->>F: Click 'Join Meeting'
    F->>Stream: Join Stream call with token
    F->>F: Switch to MeetingRoom (video, controls, layouts)

    Note over S,Stream: Meeting options...

    S->>F: Switch layout (Speaker / Grid / Paginated Grid)
    S->>F: Toggle participants list
    S->>F: Leave meeting → redirect to /dashboard
```

---

## 8. File Upload Workflows

### 8.1 S3 Presigned URL Upload

```mermaid
sequenceDiagram
    participant U as User (Mentor/Admin)
    participant F as Frontend
    participant API as Next.js API Route
    participant S3 as AWS S3 / R2

    U->>F: Select file in uploader
    F->>API: POST /api/s3/upload (filename, contentType)
    API->>S3: Generate presigned PUT URL
    S3-->>API: Presigned URL (valid 5 min)
    API-->>F: URL + file key
    F->>S3: PUT file directly (browser → S3)
    S3-->>F: 200 OK
    F->>F: Store fileKey in form state
    F->>F: Submit form with fileKey to backend
```

### 8.2 File Deletion

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant API as Next.js API Route
    participant S3 as AWS S3 / R2

    U->>F: Click delete on uploaded file
    F->>API: DELETE /api/s3/delete (fileKey)
    API->>S3: Delete object by key
    S3-->>API: 204 No Content
    API-->>F: Deleted
    F->>F: Clear fileKey from form state
```

---

## 9. Webhook Workflows

### 9.1 Clerk User Webhook

```mermaid
flowchart TD
    A[Clerk fires user event] --> B[POST /api/webhooks/clerk]
    B --> C{Verify Svix signature}
    C -->|Invalid| D[400 Bad Request]
    C -->|Valid| E{Event type?}
    E -->|user.created| F[Create user in MongoDB with clerkId, email, name]
    E -->|user.updated| G[Update user record — name, email, image]
    E -->|user.deleted| H[Handle user deletion — soft delete or cleanup]
    F --> I[200 OK]
    G --> I
    H --> I
```

### 9.2 Stripe Payment Webhook

```mermaid
flowchart TD
    A[Stripe fires event] --> B[POST /api/webhooks/stripe]
    B --> C{Verify Stripe signature}
    C -->|Invalid| D[400 Bad Request]
    C -->|Valid| E{Event type?}
    E -->|checkout.session.completed| F[Extract userId + courseId from metadata]
    F --> G[Find user + course in DB]
    G --> H{Already enrolled?}
    H -->|Yes| I[Skip — return 200]
    H -->|No| J[Create Enrollment — status: active, amount from session]
    J --> K[200 OK]
```

---

## 10. Development Workflow

### 10.1 Local Setup

```bash
# 1. Clone repository
git clone <repo-url> && cd learnix

# 2. Install dependencies
cd backend && npm install
cd ../frontend && bun install

# 3. Configure environment
cp backend/.env.example backend/.env     # Fill in all required vars
cp frontend/.env.example frontend/.env   # Fill in all required vars

# 4. Start services
# Terminal 1: Backend
cd backend && npm run dev                 # http://localhost:5000

# Terminal 2: Frontend
cd frontend && bun run dev                # http://localhost:3000
```

### 10.2 Build & Deploy

```mermaid
flowchart TD
    A[Code changes] --> B[Run ESLint: bun run lint]
    B --> C{Lint passes?}
    C -->|No| D[Fix lint errors]
    D --> B
    C -->|Yes| E[Run build: bun run build]
    E --> F{Build passes?}
    F -->|No| G[Fix build errors]
    G --> E
    F -->|Yes| H[Commit to GitHub]
    H --> I[Deploy frontend to Vercel]
    H --> J[Deploy backend to hosting]
    I --> K[Configure env vars on Vercel]
    J --> L[Configure env vars on server]
    K --> M[Verify production]
    L --> M
```

### 10.3 Commit Standards

| Pattern | Description |
|---|---|
| `feat: add quiz system` | New feature |
| `fix: resolve enrollment race condition` | Bug fix |
| `refactor: extract auth middleware` | Code restructuring |
| `docs: update README with API endpoints` | Documentation |
| `style: add bilingual comments to services` | Formatting/comments |
| `test: add unit tests for quiz service` | Test additions |

---

*End of Workflow Document*
