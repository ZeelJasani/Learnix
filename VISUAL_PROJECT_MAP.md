# 🗺️ Visual Project Map - Masterji LMS

## 🏗️ Complete Project Structure

```
📁 Masterji-Final-Year-Project/
│
├── 📁 app/ ................................. Main Application (Next.js App Router)
│   │
│   ├── 📁 (auth)/ .......................... 🔐 Authentication Pages
│   │   ├── 📁 _components/
│   │   │   └── 📄 LoginForm.tsx ............ Login form component
│   │   ├── 📁 login/
│   │   │   └── 📄 page.tsx ................. Login page
│   │   ├── 📁 verify-request/
│   │   │   └── 📄 page.tsx ................. Email verification page
│   │   └── 📄 layout.tsx ................... Auth layout wrapper
│   │
│   ├── 📁 (public)/ ........................ 🌍 Public Pages (Before Login)
│   │   ├── 📁 _components/
│   │   │   ├── 📄 Navbar.tsx ............... Main navigation bar
│   │   │   ├── 📄 PublicCourseCard.tsx ..... Course preview cards
│   │   │   └── 📄 UserDropdown.tsx ......... User menu dropdown
│   │   ├── 📁 courses/
│   │   │   ├── 📁 [slug]/
│   │   │   │   ├── 📁 _components/
│   │   │   │   │   └── 📄 EnrollmentButton.tsx .. Enroll button
│   │   │   │   ├── 📄 actions.ts ........... Enrollment logic
│   │   │   │   └── 📄 page.tsx ............. Individual course page
│   │   │   └── 📄 page.tsx ................. All courses page
│   │   ├── 📄 layout.tsx ................... Public layout wrapper
│   │   └── 📄 page.tsx ..................... Homepage/Landing page
│   │
│   ├── 📁 admin/ ........................... 👨‍💼 Admin Dashboard
│   │   ├── 📁 courses/
│   │   │   ├── 📁 _components/
│   │   │   │   └── 📄 AdminCourseCard.tsx .. Admin course cards
│   │   │   ├── 📁 [courseId]/
│   │   │   │   ├── 📁 [chapterId]/
│   │   │   │   │   └── 📁 [lessonId]/
│   │   │   │   │       ├── 📁 _components/
│   │   │   │   │       │   └── 📄 LessonForm.tsx ... Lesson editor
│   │   │   │   │       ├── 📄 actions.ts .......... Lesson actions
│   │   │   │   │       └── 📄 page.tsx ............ Lesson edit page
│   │   │   │   ├── 📁 delete/
│   │   │   │   │   ├── 📄 actions.ts .............. Delete course logic
│   │   │   │   │   └── 📄 page.tsx ................ Delete confirmation
│   │   │   │   └── 📁 edit/
│   │   │   │       ├── 📁 _components/
│   │   │   │       │   ├── 📄 CourseStructure.tsx . Course outline editor
│   │   │   │       │   ├── 📄 EditCourseForm.tsx .. Course details form
│   │   │   │       │   ├── 📄 NewChapterModel.tsx . Add chapter dialog
│   │   │   │       │   ├── 📄 NewLessonModel.tsx .. Add lesson dialog
│   │   │   │       │   ├── 📄 DeleteChapter.tsx ... Delete chapter button
│   │   │   │       │   └── 📄 DeleteLesson.tsx .... Delete lesson button
│   │   │   │       ├── 📄 actions.ts .............. Course edit actions
│   │   │   │       └── 📄 page.tsx ................ Course edit page
│   │   │   ├── 📁 create/
│   │   │   │   ├── 📄 actions.ts .................. Create course logic
│   │   │   │   └── 📄 page.tsx .................... Create course page
│   │   │   └── 📄 page.tsx ........................ Admin courses list
│   │   ├── 📄 layout.tsx ....................... Admin layout wrapper
│   │   └── 📄 page.tsx ......................... Admin dashboard home
│   │
│   ├── 📁 api/ ............................. 🔌 API Endpoints (Backend)
│   │   ├── 📁 auth/
│   │   │   └── 📁 [...all]/
│   │   │       └── 📄 route.ts ................. Auth API handler
│   │   ├── 📁 s3/
│   │   │   ├── 📁 delete/
│   │   │   │   └── 📄 route.ts ................. Delete files from S3
│   │   │   └── 📁 upload/
│   │   │       └── 📄 route.ts ................. Upload files to S3
│   │   └── 📁 webhook/
│   │       └── 📁 stripe/
│   │           └── 📄 route.ts ................. Payment webhooks
│   │
│   ├── 📁 dashboard/ ....................... 📊 Student Dashboard
│   │   ├── 📁 _components/
│   │   │   ├── 📄 CourseProgressCard.tsx ....... Progress display
│   │   │   ├── 📄 CourseSidebar.tsx ............ Course navigation
│   │   │   ├── 📄 DashboardAppSidebar.tsx ...... Main sidebar
│   │   │   └── 📄 LessonItem.tsx ............... Individual lesson item
│   │   ├── 📁 [slug]/
│   │   │   ├── 📁 [lessonId]/
│   │   │   │   ├── 📁 _components/
│   │   │   │   │   └── 📄 CourseContent.tsx .... Lesson content display
│   │   │   │   ├── 📄 actions.ts ............... Lesson progress actions
│   │   │   │   ├── 📄 LessonSkelton.tsx ........ Loading skeleton
│   │   │   │   └── 📄 page.tsx ................. Individual lesson page
│   │   │   ├── 📄 layout.tsx ................... Course layout
│   │   │   └── 📄 page.tsx ..................... Course overview
│   │   ├── 📄 layout.tsx ....................... Dashboard layout
│   │   └── 📄 page.tsx ......................... Dashboard home
│   │
│   ├── 📁 data/ ............................ 📊 Data Access Layer
│   │   ├── 📁 admin/
│   │   │   ├── 📄 admin-get-course.ts .......... Get course for admin
│   │   │   ├── 📄 admin-get-courses.ts ......... Get all courses for admin
│   │   │   ├── 📄 admin-get-dashboard-state.ts . Admin dashboard data
│   │   │   ├── 📄 admin-get-enrollment-state.ts  Enrollment statistics
│   │   │   ├── 📄 admin-get-lesson.ts .......... Get lesson for admin
│   │   │   ├── 📄 admin-get-recent-courses.ts .. Recent courses
│   │   │   └── 📄 require-admin.ts ............. Admin authentication check
│   │   ├── 📁 course/
│   │   │   ├── 📄 get-all-courses.ts ........... Public course listing
│   │   │   ├── 📄 get-course-sidebar-data.ts ... Course navigation data
│   │   │   ├── 📄 get-course.ts ................ Individual course data
│   │   │   └── 📄 get-lesson-content.ts ........ Lesson content
│   │   └── 📁 user/
│   │       ├── 📄 get-enrolled-courses.ts ...... User's enrolled courses
│   │       ├── 📄 require-user.ts .............. User authentication check
│   │       └── 📄 user-is-enrolled.ts .......... Check enrollment status
│   │
│   ├── 📁 payment/ ......................... 💳 Payment Pages
│   │   ├── 📁 cancel/
│   │   │   └── 📄 page.tsx ..................... Payment cancelled page
│   │   └── 📁 success/
│   │       └── 📄 page.tsx ..................... Payment success page
│   │
│   ├── 📁 not-admin/
│   │   └── 📄 page.tsx ......................... Access denied page
│   │
│   ├── 📄 favicon.ico .......................... Website icon
│   ├── 📄 globals.css .......................... Global styles
│   └── 📄 layout.tsx ........................... Root layout (master template)
│
├── 📁 components/ .......................... 🧩 Reusable UI Components
│   │
│   ├── 📁 file-uploader/
│   │   ├── 📄 RenderState.tsx .................. Upload status display
│   │   └── 📄 Uploader.tsx ..................... Main upload component
│   │
│   ├── 📁 general/
│   │   └── 📄 EmptyState.tsx ................... Empty state placeholder
│   │
│   ├── 📁 rich-text-editor/
│   │   ├── 📄 Editor.tsx ....................... Rich text editor
│   │   ├── 📄 Menubar.tsx ...................... Editor toolbar
│   │   └── 📄 RenderDescription.tsx ............ Display formatted text
│   │
│   ├── 📁 sidebar/
│   │   ├── 📄 app-sidebar.tsx .................. Main application sidebar
│   │   ├── 📄 chart-area-interactive.tsx ....... Interactive charts
│   │   ├── 📄 nav-main.tsx ..................... Main navigation
│   │   ├── 📄 nav-secondary.tsx ................ Secondary navigation
│   │   ├── 📄 nav-user.tsx ..................... User navigation
│   │   ├── 📄 section-cards.tsx ................ Dashboard cards
│   │   └── 📄 site-header.tsx .................. Site header
│   │
│   └── 📁 ui/ .............................. Basic UI Building Blocks
│       ├── 📄 alert-dialog.tsx ................. Modal dialogs
│       ├── 📄 avatar.tsx ....................... User avatars
│       ├── 📄 badge.tsx ........................ Status badges
│       ├── 📄 breadcrumb.tsx ................... Navigation breadcrumbs
│       ├── 📄 button.tsx ....................... Buttons
│       ├── 📄 card.tsx ......................... Card containers
│       ├── 📄 chart.tsx ........................ Chart components
│       ├── 📄 checkbox.tsx ..................... Checkboxes
│       ├── 📄 collapsible.tsx .................. Collapsible sections
│       ├── 📄 dialog.tsx ....................... Dialog modals
│       ├── 📄 drawer.tsx ....................... Slide-out drawers
│       ├── 📄 dropdown-menu.tsx ................ Dropdown menus
│       ├── 📄 form.tsx ......................... Form components
│       ├── 📄 input-otp.tsx .................... OTP input fields
│       ├── 📄 input.tsx ........................ Text inputs
│       ├── 📄 label.tsx ........................ Form labels
│       ├── 📄 progress.tsx ..................... Progress bars
│       ├── 📄 select.tsx ....................... Select dropdowns
│       ├── 📄 separator.tsx .................... Visual separators
│       ├── 📄 sheet.tsx ........................ Sheet modals
│       ├── 📄 sidebar.tsx ...................... Sidebar component
│       ├── 📄 skeleton.tsx ..................... Loading skeletons
│       ├── 📄 sonner.tsx ....................... Toast notifications
│       ├── 📄 table.tsx ........................ Data tables
│       ├── 📄 tabs.tsx ......................... Tab components
│       ├── 📄 textarea.tsx ..................... Text areas
│       ├── 📄 theme-provider.tsx ............... Theme management
│       ├── 📄 themeToggle.tsx .................. Theme toggle button
│       ├── 📄 toggle-group.tsx ................. Toggle button groups
│       ├── 📄 toggle.tsx ....................... Toggle buttons
│       └── 📄 tooltip.tsx ...................... Tooltips
│
├── 📁 docs/ ............................... 📚 Documentation
│   └── 📁 diagrams/
│       ├── 📄 activity-enrollment.mmd .......... Enrollment flow diagram
│       ├── 📄 activity-login.mmd ............... Login flow diagram
│       ├── 📄 architecture.mmd ................. System architecture
│       ├── 📄 dfd-level-0.mmd .................. Data flow diagram (Level 0)
│       ├── 📄 dfd-level-1.mmd .................. Data flow diagram (Level 1)
│       ├── 📄 dfd-level-2.mmd .................. Data flow diagram (Level 2)
│       ├── 📄 er.mmd ........................... Entity relationship diagram
│       ├── 📄 README.md ........................ Diagrams documentation
│       ├── 📄 system-design.mmd ................ System design overview
│       └── 📄 use-case.mmd ..................... Use case diagram
│
├── 📁 hooks/ .............................. 🎣 Custom React Hooks
│   ├── 📄 try-catch.ts ......................... Error handling hook
│   ├── 📄 use-confetti.ts ...................... Celebration animations
│   ├── 📄 use-construct-url.ts ................. URL construction helper
│   ├── 📄 use-course-progress.ts ............... Course progress tracking
│   ├── 📄 use-mobile.ts ........................ Mobile device detection
│   └── 📄 use-signout.ts ....................... Sign out functionality
│
├── 📁 lib/ ................................ 📚 Utility Libraries & Configuration
│   ├── 📁 generated/
│   │   └── 📁 prisma/ .......................... Auto-generated database client
│   │       ├── 📄 client.d.ts .................. TypeScript definitions
│   │       ├── 📄 client.js .................... Database client
│   │       ├── 📄 index.d.ts ................... Main type definitions
│   │       ├── 📄 index.js ..................... Main client file
│   │       ├── 📄 schema.prisma ................ Database schema copy
│   │       └── 📁 runtime/ ..................... Runtime files
│   ├── 📄 arcjet.ts ............................ Security service config
│   ├── 📄 auth-client.ts ....................... Client-side auth
│   ├── 📄 auth.ts .............................. Server-side auth config
│   ├── 📄 db.ts ................................ Database connection
│   ├── 📄 env.ts ............................... Environment variables
│   ├── 📄 resend.ts ............................ Email service config
│   ├── 📄 S3Client.ts .......................... File storage config
│   ├── 📄 stripe.ts ............................ Payment service config
│   ├── 📄 types.ts ............................. TypeScript type definitions
│   ├── 📄 utils.ts ............................. Utility functions
│   └── 📄 zodSchemas.ts ........................ Data validation schemas
│
├── 📁 prisma/ ............................. 🗄️ Database Configuration
│   └── 📄 schema.prisma ........................ Database schema definition
│
├── 📁 public/ ............................. 🌐 Static Assets
│   ├── 📄 backup.md ............................ Backup documentation
│   ├── 📄 file.svg ............................. File icon
│   ├── 📄 globe.svg ............................ Globe icon
│   ├── 📄 masterji.png ......................... Logo image
│   ├── 📄 next.svg ............................. Next.js logo
│   ├── 📄 vercel.svg ........................... Vercel logo
│   └── 📄 window.svg ........................... Window icon
│
├── 📁 reports/ ............................ 📊 Project Reports
│   ├── 📁 final/
│   │   ├── 📄 week1.md ......................... Final report week 1
│   │   ├── 📄 week2.md ......................... Final report week 2
│   │   ├── 📄 week3.md ......................... Final report week 3
│   │   ├── 📄 week4.md ......................... Final report week 4
│   │   ├── 📄 week5.md ......................... Final report week 5
│   │   ├── 📄 week6.md ......................... Final report week 6
│   │   └── 📄 week7.md ......................... Final report week 7
│   ├── 📄 week1.md ............................. Weekly report 1
│   ├── 📄 week2.md ............................. Weekly report 2
│   ├── 📄 week3.md ............................. Weekly report 3
│   ├── 📄 week4.md ............................. Weekly report 4
│   ├── 📄 week5.md ............................. Weekly report 5
│   ├── 📄 week6.md ............................. Weekly report 6
│   └── 📄 week7.md ............................. Weekly report 7
│
├── 📄 .gitignore .............................. Git ignore rules
├── 📄 components.json ......................... UI components config
├── 📄 eslint.config.mjs ....................... Code linting rules
├── 📄 middleware.ts ........................... Request middleware (security)
├── 📄 next-env.d.ts ........................... Next.js TypeScript config
├── 📄 next.config.js .......................... Next.js configuration
├── 📄 package-lock.json ....................... Exact dependency versions
├── 📄 package.json ............................ Project dependencies & scripts
├── 📄 postcss.config.mjs ...................... CSS processing config
├── 📄 README.md ............................... Project documentation
└── 📄 tsconfig.json ........................... TypeScript configuration
```

## 🎯 Key Areas Explained

### 🔐 **Authentication Flow**
```
User visits site → (public) pages
User clicks login → (auth)/login → Authentication system
Successful login → Redirect to dashboard or admin
Failed login → Stay on login with error
```

### 📚 **Course Creation Flow**
```
Admin login → admin/courses → create new course
Fill course details → Upload thumbnail → Set pricing
Create chapters → Add lessons to chapters
Upload lesson content → Publish course
```

### 🎓 **Student Learning Flow**
```
Browse courses → (public)/courses → Select course
Enroll & pay → Payment processing → Access granted
Dashboard → Select course → View lessons
Complete lessons → Track progress → Get certificate
```

### 💾 **Data Flow**
```
User Interface (React Components)
        ↕️
API Routes (Server Actions)
        ↕️
Data Layer (Prisma ORM)
        ↕️
PostgreSQL Database
```

### 🔧 **File Organization Principles**

1. **Route-based Structure** (`app/` folder)
   - Each folder represents a URL route
   - `(auth)` = `/login`, `/verify-request`
   - `admin` = `/admin/*`
   - `dashboard` = `/dashboard/*`

2. **Component Hierarchy**
   - `_components/` = Private to that route
   - `components/` = Shared across entire app
   - `ui/` = Basic building blocks

3. **Separation of Concerns**
   - `actions.ts` = Server-side logic
   - `page.tsx` = UI components
   - `layout.tsx` = Shared layouts
   - `data/` = Database queries

4. **Configuration Files**
   - Root level = Project-wide settings
   - `lib/` = Utility configurations
   - `prisma/` = Database schema

This structure makes the codebase:
- **Easy to navigate** - logical folder organization
- **Scalable** - can add new features without restructuring
- **Maintainable** - clear separation of responsibilities
- **Collaborative** - multiple developers can work simultaneously
