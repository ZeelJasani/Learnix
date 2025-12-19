**Masterji** is a modern, full-stack Learning Management System (LMS) built with cutting-edge web technologies. It provides a comprehensive platform for creating, managing, and delivering online courses with advanced features like drag-and-drop course structuring, rich text editing, and secure file management.

## Tech Stack

### Frontend
- **Framework**: [Next.js 15.4.6](https://nextjs.org/) (App Router)
- **Language**: [TypeScript 5.0](https://www.typescriptlang.org/)
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
- **Screen Reader**: ARIA labels and descriptions
