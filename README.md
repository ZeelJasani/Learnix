<!-- **Learnix** 🎓

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Clerk](https://img.shields.io/badge/Clerk-000000?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com/)
[![Stripe](https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)

## 🚀 Project Overview

Learnix is a modern, full-stack e-learning platform that enables users to access educational content, track their progress, and engage with courses. Built with Next.js and TypeScript, it provides a seamless learning experience with features like course enrollment, progress tracking, and secure payments.

## ✨ Key Features

- 🔐 **Authentication & Authorization** - Secure user authentication with Clerk
- 📚 **Course Management** - Create, read, update, and delete courses
- 📊 **Progress Tracking** - Track lesson completion and course progress
- 💳 **Payment Integration** - Secure payment processing with Stripe
- 🖼️ **Media Handling** - Upload and manage course content with AWS S3
- 📱 **Responsive Design** - Works seamlessly across all devices
- 🎨 **Modern UI** - Built with Radix UI and Tailwind CSS
- 🔄 **Real-time Updates** - Interactive learning experience with real-time progress updates

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Shadcn/ui
- **State Management**: React Context API
- **Form Handling**: React Hook Form with Zod validation
- **Drag & Drop**: @dnd-kit
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/) + CSS Modules
- **UI Components**: [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [React Query](https://tanstack.com/query/latest) + [Zustand](https://github.com/pmndrs/zustand)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/) + [Tabler Icons](https://tabler.io/icons)

### Backend
- **Runtime**: [Node.js 18+](https://nodejs.org/)
- **API**: [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) (Better Auth)
- **File Storage**: [AWS SDK v3](https://aws.amazon.com/sdk-for-javascript/)
- **Email Service**: [Resend](https://resend.com/)
- **Security**: [Arcjet](https://arcjet.com/)

### Database
- **Primary Database**: [PostgreSQL 16](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/) (Type-safe database client)
- **Migrations**: Version-controlled with Prisma Migrate

### DevOps & Tools
- **Hosting**: [Vercel](https://vercel.com/)
- **CI/CD**: [GitHub Actions](https://github.com/features/actions)
- **Containerization**: [Docker](https://www.docker.com/)
- **Linting/Formatting**: [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/)
- **Testing**: [Jest](https://jestjs.io/) + [Playwright](https://playwright.dev/) + [React Testing Library](https://testing-library.com/)

## Key Features

- **User Authentication**: Secure login with multiple providers (GitHub, email OTP)
- **Course Management**: Create and organize courses with chapters and lessons
- **Rich Content Editor**: Advanced text editing with TipTap integration
- **File Management**: Secure file uploads with S3-compatible storage
- **Responsive Design**: Mobile-first approach with modern UI components
- **Admin Dashboard**: Comprehensive course administration tools
- **Payment Processing**: Integrated Stripe payment system

## Folder Structure

```
masterji/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Authentication routes
│   │   ├── _components/         # Auth-specific components
│   │   ├── login/               # Login page
│   │   └── verify-request/      # Email verification
│   ├── (public)/                # Public routes
│   │   ├── _components/         # Public components (Navbar, UserDropdown)
│   │   └── page.tsx             # Landing page
│   ├── admin/                   # Admin dashboard
│   │   ├── courses/             # Course management
│   │   │   ├── _components/     # Admin course components
│   │   │   ├── [courseId]/      # Dynamic course routes
│   │   │   │   └── edit/        # Course editing interface
│   │   │   └── create/          # Course creation
│   │   └── layout.tsx           # Admin layout
│   ├── api/                     # API routes
│   │   ├── auth/                # Authentication endpoints
│   │   └── s3/                  # File upload/delete endpoints
│   ├── data/                    # Server-side data functions
│   │   └── admin/               # Admin-specific data operations
│   ├── globals.css              # Global styles
│   └── layout.tsx               # Root layout
├── components/                   # Reusable UI components
│   ├── file-uploader/           # File upload components
│   ├── rich-text-editor/        # TipTap-based text editor
│   ├── sidebar/                 # Navigation components
│   └── ui/                      # shadcn/ui components
├── hooks/                       # Custom React hooks
├── lib/                         # Utility libraries
│   ├── generated/               # Prisma generated types
│   ├── auth.ts                  # Authentication configuration
│   ├── db.ts                    # Database connection
│   ├── S3Client.ts              # S3 client configuration
│   └── zodSchemas.ts            # Data validation schemas
├── prisma/                      # Database schema and migrations
│   └── schema.prisma            # Prisma schema definition
├── public/                      # Static assets
└── middleware.ts                # Next.js middleware
```



## 💻 Usage

### For Learners
1. **Browse Courses**: Visit the public landing page to explore available courses
2. **User Registration**: Sign up using email or GitHub OAuth
3. **Course Access**: Enroll in courses and track progress
4. **Learning Interface**: Access course content through organized chapters and lessons

### For Instructors/Admins
1. **Admin Access**: Login with admin credentials
2. **Course Creation**: Use the admin dashboard to create new courses
3. **Content Management**: Organize courses into chapters and lessons
4. **Media Upload**: Upload images and videos using the integrated file manager
5. **Course Publishing**: Manage course status (draft, published, archived)

### Key Functionalities
- **Authentication**: Secure login with multiple providers

### Authentication & Security
- **Better Auth**: Modern authentication library with multiple providers
- **GitHub OAuth**: Social login integration

### Storage & Media
- **AWS S3**: Scalable file storage for images and videos
- **Presigned URLs**: Secure, time-limited file access

### Database & ORM
- **Prisma**: Type-safe database client and migrations
- **PostgreSQL**: Robust relational database

### Email & Communication
- **Resend**: Transactional email service for verification

### UI & Components
- **shadcn/ui**: High-quality, accessible UI components
- **Radix UI**: Unstyled, accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework

## 🚀 Performance & Best Practices

### Optimizations Implemented
- **Next.js 15**: Latest framework with App Router
- **Turbopack**: Fast bundler for development
- **Image Optimization**: Next.js built-in image optimization
- **Code Splitting**: Automatic route-based code splitting
- **TypeScript**: Type safety and better developer experience

### Security Best Practices
- **Input Validation**: Zod schema validation
- **Rate Limiting**: API protection against abuse
- **Secure File Uploads**: Presigned URLs and file type validation
- **Authentication**: Secure session management
- **Environment Variables**: Proper secret management

### Accessibility
- **Radix UI**: Built-in accessibility features
- **Semantic HTML**: Proper HTML structure
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels and descriptions -->








<div align="center">

# 🎓 Learnix

### Next-Generation E-Learning Platform

*Empowering education through modern web technology*



**Built with cutting-edge technologies for seamless learning experiences**

</div>

<br/>

## 📖 Table of Contents

- [What is Learnix?](#what-is-learnix)
- [Why Learnix?](#why-learnix)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Architecture](#project-architecture)
- [Core Features](#core-features)
- [User Guides](#user-guides)
- [API Documentation](#api-documentation)
- [Performance & Security](#performance--security)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 What is Learnix?

Learnix is a **production-ready, full-stack e-learning platform** designed to deliver seamless educational experiences. Built on Next.js 15 with TypeScript, it combines modern web development practices with robust backend infrastructure to create a scalable, secure, and user-friendly learning management system.

> **Perfect for:** Educational institutions, online course creators, corporate training programs, and individual instructors looking for a comprehensive learning platform.

---

## 💡 Why Learnix?

| Feature | Description |
|---------|-------------|
| **🚀 Blazing Fast** | Powered by Next.js 15 with Turbopack for lightning-fast development and production builds |
| **🔒 Enterprise Security** | Multi-layered security with Better Auth, Arcjet protection, and secure file handling |
| **📱 Responsive First** | Mobile-optimized design that works flawlessly across all devices |
| **🎨 Modern UI/UX** | Beautiful, accessible components built with Radix UI and Tailwind CSS |
| **💳 Payment Ready** | Integrated Stripe for seamless course monetization |
| **☁️ Cloud Native** | AWS S3 integration for scalable media storage |

---

## 🛠️ Technology Stack

<details>
<summary><b>Frontend Technologies</b> (Click to expand)</summary>
```yaml
Framework: Next.js 14 (App Router)
Language: TypeScript
Styling: 
  - Tailwind CSS 4.0
  - CSS Modules
UI Libraries:
  - Radix UI (Accessible primitives)
  - shadcn/ui (Component library)
State Management:
  - React Query (Server state)
  - Zustand (Client state)
Form Handling:
  - React Hook Form
  - Zod (Validation)
Rich Text: TipTap Editor
Drag & Drop: @dnd-kit
Icons: Lucide React, Tabler Icons
```

</details>

<details>
<summary><b>Backend Infrastructure</b> (Click to expand)</summary>
```yaml
Runtime: Node.js 18+
API: Next.js Route Handlers
Authentication: Better Auth (NextAuth.js)
Database:
  - PostgreSQL 16
  - Prisma ORM
File Storage: AWS SDK v3 (S3)
Email: Resend
Security: Arcjet
Payment: Stripe
```

</details>

<details>
<summary><b>Development & DevOps</b> (Click to expand)</summary>
```yaml
Hosting: Vercel
Version Control: Git + GitHub
CI/CD: GitHub Actions
Containerization: Docker
Code Quality:
  - ESLint
  - Prettier
Testing:
  - Jest (Unit)
  - Playwright (E2E)
  - React Testing Library
```

</details>

---

## 🚀 Getting Started

### Prerequisites
```bash
Node.js >= 18.0.0
PostgreSQL >= 16
npm or yarn or pnpm
AWS Account (for S3)
Stripe Account
```

### Installation

**Step 1:** Clone the repository
```bash
git clone https://github.com/yourusername/learnix.git
cd learnix
```

**Step 2:** Install dependencies
```bash
npm install
# or
pnpm install
```

**Step 3:** Configure environment variables
```bash
cp .env.example .env.local
```

Required environment variables:
```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
AUTH_SECRET="your-secret-key"
AUTH_GITHUB_ID="..."
AUTH_GITHUB_SECRET="..."

# AWS S3
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="..."
AWS_S3_BUCKET="..."

# Stripe
STRIPE_SECRET_KEY="..."
STRIPE_WEBHOOK_SECRET="..."

# Email
RESEND_API_KEY="..."
```

**Step 4:** Set up the database
```bash
npx prisma generate
npx prisma db push
npx prisma db seed  # Optional: seed with demo data
```

**Step 5:** Start development server
```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

---

## 🏗️ Project Architecture
```
📦 learnix/
│
├── 🎨 app/                      # Next.js App Router
│   ├── (auth)/                  # 🔐 Authentication flow
│   │   ├── login/
│   │   └── verify-request/
│   │
│   ├── (public)/                # 🌍 Public-facing pages
│   │   ├── _components/
│   │   └── page.tsx
│   │
│   ├── admin/                   # 👨‍💼 Admin dashboard
│   │   ├── courses/
│   │   │   ├── [courseId]/edit/
│   │   │   └── create/
│   │   └── layout.tsx
│   │
│   ├── api/                     # 🔌 API endpoints
│   │   ├── auth/
│   │   └── s3/
│   │
│   └── data/                    # 📊 Server actions
│
├── 🧩 components/               # Reusable components
│   ├── file-uploader/
│   ├── rich-text-editor/
│   ├── sidebar/
│   └── ui/                      # shadcn/ui components
│
├── 🪝 hooks/                    # Custom React hooks
│
├── 📚 lib/                      # Utilities & configs
│   ├── auth.ts
│   ├── db.ts
│   ├── S3Client.ts
│   └── zodSchemas.ts
│
├── 🗄️ prisma/                   # Database schema
│   └── schema.prisma
│
└── 🔒 middleware.ts             # Route protection
```

---

## ✨ Core Features

### 🔐 Authentication & Authorization
- Multi-provider authentication (GitHub OAuth, Email OTP)
- Secure session management with Better Auth
- Role-based access control (Student, Instructor, Admin)
- Email verification system

### 📚 Course Management System
- **Create & Edit**: Intuitive course creation interface
- **Chapter Organization**: Drag-and-drop chapter reordering
- **Lesson Management**: Rich content lessons with multimedia support
- **Draft System**: Save and preview before publishing

### 🎥 Rich Media Support
- AWS S3 integration for scalable storage
- Image and video upload with progress tracking
- Presigned URLs for secure file access
- Automatic file type validation

### 📊 Progress Tracking
- Real-time lesson completion tracking
- Course progress visualization
- Personal learning dashboard
- Achievement system

### 💳 Payment Integration
- Stripe checkout for course purchases
- Secure payment processing
- Webhook handling for payment events
- Subscription management support

### 🎨 Modern User Interface
- Responsive design for all screen sizes
- Dark mode support
- Accessible components (WCAG compliant)
- Smooth animations and transitions

---

## 👥 User Guides

### For Students

1. **Getting Started**
   - Sign up using email or GitHub
   - Browse available courses
   - Enroll in courses of interest

2. **Learning Experience**
   - Access course dashboard
   - Navigate through chapters and lessons
   - Track your progress
   - Complete lessons at your own pace

### For Instructors

1. **Access Admin Panel**
```
   Navigate to /admin after logging in with instructor credentials
```

2. **Create a New Course**
   - Click "Create Course" button
   - Fill in course details (title, description, category)
   - Upload course thumbnail
   - Set pricing information

3. **Add Content**
   - Create chapters within your course
   - Add lessons to each chapter
   - Use the rich text editor for lesson content
   - Upload supplementary materials

4. **Publish Course**
   - Review all content
   - Set course status to "Published"
   - Monitor enrollments and feedback

---

## 🔌 API Documentation

### Authentication Endpoints
```typescript
POST   /api/auth/signin          // Sign in user
POST   /api/auth/signout         // Sign out user
POST   /api/auth/verify          // Verify email
GET    /api/auth/session         // Get current session
```

### File Upload Endpoints
```typescript
POST   /api/s3/upload            // Upload file to S3
DELETE /api/s3/delete            // Delete file from S3
```

### Course API (Server Actions)
```typescript
// Located in app/data/admin/
getCourses()                     // Fetch all courses
getCourseById(id)                // Fetch single course
createCourse(data)               // Create new course
updateCourse(id, data)           // Update course
deleteCourse(id)                 // Delete course
```

---

## ⚡ Performance & Security

### Performance Optimizations

- ✅ Next.js 15 with Turbopack for faster builds
- ✅ Automatic code splitting and lazy loading
- ✅ Image optimization with Next/Image
- ✅ React Server Components for reduced bundle size
- ✅ Edge runtime for faster API responses
- ✅ PostgreSQL query optimization with Prisma

### Security Measures

- 🔒 Input validation with Zod schemas
- 🔒 Rate limiting with Arcjet
- 🔒 CSRF protection
- 🔒 SQL injection prevention via Prisma
- 🔒 XSS protection with Content Security Policy
- 🔒 Secure file uploads with type validation
- 🔒 Environment variable protection

### Accessibility Features

- ♿ WCAG 2.1 Level AA compliant
- ♿ Keyboard navigation support
- ♿ Screen reader optimization
- ♿ Semantic HTML structure
- ♿ ARIA labels and descriptions

---
<!-- </div> -->