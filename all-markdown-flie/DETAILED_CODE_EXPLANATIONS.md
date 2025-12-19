# 🧑‍💻 Detailed Code Explanations - Masterji LMS

## 📋 Table of Contents
1. [Main Application Layout](#main-application-layout)
2. [Database Schema Explained](#database-schema-explained)
3. [Authentication System](#authentication-system)
4. [Security Middleware](#security-middleware)
5. [Key Components Breakdown](#key-components-breakdown)
6. [API Routes Explained](#api-routes-explained)

---

## 🏗️ Main Application Layout

### `app/layout.tsx` - The Foundation of Every Page

```typescript
// This file is like the "master template" for the entire website
// Every page will use this as its base structure

import type { Metadata } from "next";           // For SEO and page information
import { Geist, Geist_Mono } from "next/font/google";  // Google fonts for typography
import "./globals.css";                         // Global styles that apply everywhere
import { ThemeProvider } from "@/components/ui/theme-provider";  // Dark/light mode support
import { Toaster } from "@/components/ui/sonner";               // Notification system

// Define the fonts we want to use throughout the site
const geistSans = Geist({
  variable: "--font-geist-sans",    // CSS variable name for this font
  subsets: ["latin"],               // Character set (English alphabet)
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",    // CSS variable for monospace font (code)
  subsets: ["latin"],
});

// SEO information that appears in browser tabs and search results
export const metadata: Metadata = {
  title: "Masterji",                    // Browser tab title
  description: "Learn from the best",   // Search engine description
};

// The main layout component that wraps every page
export default function RootLayout({
  children,  // This represents the actual page content
}: Readonly<{
  children: React.ReactNode;  // Type definition: any valid React content
}>) {
  return (
    // The HTML structure that every page will have
    <html lang="en" suppressHydrationWarning={true}>
      <body 
        suppressHydrationWarning={true} 
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Theme provider enables dark/light mode switching */}
        <ThemeProvider
          attribute="class"              // Use CSS classes for themes
          defaultTheme="system"          // Follow user's system preference
          enableSystem                   // Allow system theme detection
          disableTransitionOnChange      // No animation when switching themes
        >
          {children}                     {/* The actual page content goes here */}
          
          {/* Notification system - shows success/error messages */}
          <Toaster closeButton position="bottom-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**What this does in simple terms:**
- Sets up the basic HTML structure for every page
- Loads fonts and styles
- Enables dark/light mode switching
- Sets up the notification system
- Provides SEO information for search engines

---

## 🗄️ Database Schema Explained

### `prisma/schema.prisma` - The Data Blueprint

```prisma
// This file defines how data is stored in the database
// Think of it as creating filing cabinets with specific compartments

// Configuration: tells Prisma how to generate the database client
generator client {
  provider = "prisma-client-js"           // Use JavaScript client
  output   = "../lib/generated/prisma"    // Where to put generated code
}

// Database connection: tells Prisma where the database is
datasource db {
  provider = "postgresql"      // We're using PostgreSQL database
  url      = env("DATABASE_URL") // Connection string from environment variables
}

// USER TABLE - Stores information about every person using the platform
model User {
  // Basic identification
  id            String       @id              // Unique identifier (like a student ID)
  name          String                        // Full name
  email         String                        // Email address
  emailVerified Boolean                       // Has email been confirmed?
  image         String?                       // Profile picture (optional)
  
  // Timestamps - when was this record created/updated
  createdAt     DateTime                      // Account creation date
  updatedAt     DateTime                      // Last modification date
  
  // Relationships - connections to other tables
  sessions      Session[]                     // Login sessions
  accounts      Account[]                     // Social media accounts (GitHub, etc.)
  course        Course[]                      // Courses this user created (if instructor)
  enrollment    Enrollment[]                  // Courses this user enrolled in (if student)
  lessonProgress LessonProgress[]             // Progress on individual lessons
  
  // Payment information
  stripeCustomerId String? @unique            // Stripe payment system ID
  
  // Admin/moderation fields
  role       String?                          // User role (admin, instructor, student)
  banned     Boolean?                         // Is user banned?
  banReason  String?                          // Why were they banned?
  banExpires DateTime?                        // When does ban expire?
  
  // Database constraints
  @@unique([email])                           // Email must be unique
  @@map("user")                              // Table name in database
}

// COURSE TABLE - Stores information about each course
model Course {
  // Basic course information
  id          String      @id @default(uuid())  // Unique course ID
  title       String                            // Course name
  description String                            // Detailed description
  fileKey     String                            // Thumbnail image file reference
  price       Int                               // Price in cents (e.g., 2999 = $29.99)
  duration    Int                               // Course length in hours
  level       CourseLevel @default(BEGINNER)    // Difficulty level
  
  // Payment integration
  stripePriceId String @unique                  // Stripe payment system reference
  
  // Organization
  category         String                       // Course category
  smallDescription String                       // Brief summary
  slug             String       @unique         // URL-friendly name
  status           CourseStatus @default(DRAFT) // Publication status
  
  // Timestamps
  createdAt        DateTime     @default(now()) // When course was created
  updatedAt        DateTime     @updatedAt      // Last modification
  
  // Relationships
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId String                                 // Who created this course
  
  chapter    Chapter[]                          // Course chapters
  enrollment Enrollment[]                       // Who enrolled in this course
}

// ENROLLMENT TABLE - Tracks who signed up for which courses
model Enrollment {
  id String @id @default(uuid())               // Unique enrollment ID
  
  amount  Int                                   // How much they paid
  status EnrollmentStatus @default(Pending)    // Payment/enrollment status
  
  // Timestamps
  createdAt DateTime @default(now())           // When they enrolled
  updatedAt DateTime @updatedAt                // Last status change
  
  // Relationships - connects users to courses
  Course    Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  courseId  String                             // Which course
  User      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    String                             // Which user
  
  // Constraint: one user can only enroll once per course
  @@unique([userId, courseId])
}

// LESSON PROGRESS TABLE - Tracks individual lesson completion
model LessonProgress {
  id String @id @default(uuid())               // Unique progress record ID
  
  completed Boolean @default(false)            // Has user completed this lesson?
  
  // Timestamps
  createdAt DateTime @default(now())           // When progress started
  updatedAt DateTime @updatedAt                // Last progress update
  
  // Relationships
  User User @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId String                                // Which user
  
  Lesson Lesson @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  lessonId String                              // Which lesson
  
  // Constraint: one progress record per user per lesson
  @@unique([userId, lessonId])
}
```

**What this does in simple terms:**
- Creates "filing cabinets" (tables) for different types of data
- Defines what information goes in each "file folder" (record)
- Sets up relationships between different types of data
- Ensures data integrity with constraints and rules

---

## 🔐 Authentication System

### `lib/auth.ts` - User Login and Security

```typescript
import { betterAuth } from "better-auth";                    // Modern auth library
import { prismaAdapter } from "better-auth/adapters/prisma"; // Database integration
import { prisma } from "./db";                               // Database connection
import { env } from "./env";                                 // Environment variables
import { emailOTP } from "better-auth/plugins";              // Email verification
import { resend } from "./resend";                           // Email service
import { admin } from "better-auth/plugins";                 // Admin functionality

// Configure the authentication system
export const auth = betterAuth({
  // Database setup - where to store user accounts and sessions
  database: prismaAdapter(prisma, {
    provider: "postgresql",  // We're using PostgreSQL database
  }),
  
  // Social login providers - let users login with existing accounts
  socialProviders: {
    github: {
      clientId: env.AUTH_GITHUB_CLIENT_ID,      // GitHub app ID
      clientSecret: env.AUTH_GITHUB_SECRET,     // GitHub app secret
    },
  },
  
  // Additional features (plugins)
  plugins: [
    // Email verification system
    emailOTP({
      // Function that sends verification emails
      async sendVerificationOTP({ email, otp }) {
        await resend.emails.send({
          from: "MasterjiLMS <onboarding@resend.dev>",  // Sender address
          to: [email],                                   // Recipient
          subject: "Masterji - Verify your email",      // Email subject
          html: `<p>Your OTP is <strong>${otp}</strong></p>`, // Email content
        });
      },
    }),
    
    // Admin functionality - special permissions for administrators
    admin(),
  ],
});
```

**What this does in simple terms:**
- Sets up user login/logout functionality
- Allows users to login with GitHub
- Sends verification emails with one-time passwords
- Manages user sessions (staying logged in)
- Provides admin privileges for certain users

---

## 🛡️ Security Middleware

### `middleware.ts` - The Security Guard

```typescript
import arcjet, { createMiddleware, detectBot } from "@arcjet/next"; // Security service
import { getSessionCookie } from "better-auth/cookies";             // Session management
import { NextRequest, NextResponse } from "next/server";            // Next.js server types

// Configure Arcjet security service
const aj = arcjet({
  key: process.env.ARCJET_KEY!,  // API key for Arcjet service
  rules: [
    // Bot detection - block malicious automated traffic
    detectBot({
      mode: "LIVE",              // Actually block bots (not just log them)
      // Allow these types of bots (good bots)
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc.
        "CATEGORY:MONITOR",       // Uptime monitoring services
        "CATEGORY:PREVIEW",       // Link previews (Slack, Discord)
        "STRIPE_WEBHOOK"          // Stripe payment notifications
      ],
    }),
  ],
});

// Authentication middleware - checks if user is logged in
async function authMiddleware(request: NextRequest) {
  // Get the user's session cookie
  const sessionCookie = getSessionCookie(request);
  
  // If no session cookie, redirect to login page
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  // If session exists, allow access
  return NextResponse.next();
}

// Configuration - which routes this middleware applies to
export const config = {
  // Run on all routes except static files (images, CSS, JS)
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

// Main middleware function - runs on every request
export default createMiddleware(aj, async (request: NextRequest) => {
  // If accessing admin pages, check authentication
  if(request.nextUrl.pathname.startsWith("/admin")) {
    return authMiddleware(request);
  }
  
  // For all other pages, just continue
  return NextResponse.next();
});
```

**What this does in simple terms:**
- Acts like a security guard at the building entrance
- Blocks malicious bots and automated attacks
- Checks if users are logged in before accessing admin pages
- Redirects unauthorized users to the login page
- Allows good bots (search engines) to access the site

---

## 🧩 Key Components Breakdown

### File Uploader Component Structure

```typescript
// components/file-uploader/Uploader.tsx
// This component handles file uploads (images, videos, documents)

interface iAppProps {
  value: string;                           // Current file URL
  onChange?: (value: string) => void;      // Function called when file changes
  fileTypeAccepted: "image" | "video";     // What type of files to accept
}

export function Uploader({ onChange, value, fileTypeAccepted }: iAppProps) {
  // Component logic here...
  
  // What this component does:
  // 1. Shows a drag-and-drop area
  // 2. Validates file type and size
  // 3. Uploads file to cloud storage (S3)
  // 4. Returns the file URL
  // 5. Shows upload progress
  // 6. Handles errors gracefully
}
```

### Rich Text Editor Structure

```typescript
// components/rich-text-editor/Editor.tsx
// Advanced text editor for course content creation

export function Editor({ 
  content,      // Current text content
  onChange,     // Function called when content changes
  placeholder   // Placeholder text
}) {
  // Uses TipTap editor library
  // Provides features like:
  // - Bold, italic, underline
  // - Headers and lists
  // - Links and images
  // - Code blocks
  // - Undo/redo
  // - Real-time collaboration
}
```

---

## 🔌 API Routes Explained

### Course Enrollment API

```typescript
// app/(public)/courses/[slug]/actions.ts
// Handles course enrollment and payment processing

export async function enrollInCourseAction(courseId: string): Promise<ApiResponse> {
  // Step 1: Verify user is logged in
  const user = await requireUser();
  
  // Step 2: Rate limiting - prevent spam enrollments
  const decision = await aj.protect(req, {
    fingerprint: user.id,  // Identify user
  });
  
  // Step 3: Get course information
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    // Only get the fields we need
    select: {
      id: true,
      title: true,
      price: true,
      slug: true,
      stripePriceId: true,
    },
  });
  
  // Step 4: Database transaction - ensure data consistency
  const transactionResult = await prisma.$transaction(async (tx) => {
    // Create Stripe customer for payment
    const freshCustomer = await stripe.customers.create({
      email: user.email,
      name: user.name || '',
      metadata: { userId: user.id },
    });
    
    // Create enrollment record
    const enrollment = await tx.enrollment.create({
      data: {
        userId: user.id,
        courseId: courseId,
        amount: currentCourse.price,
        status: "Pending",
      },
    });
    
    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: freshCustomer.id,
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: currentCourse.title },
          unit_amount: currentCourse.price,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${env.BETTER_AUTH_URL}/payment/success`,
      cancel_url: `${env.BETTER_AUTH_URL}/payment/cancel`,
      metadata: {
        userId: user.id,
        courseId: courseId,
        enrollmentId: enrollment.id,
      },
    });
    
    return { enrollment, checkoutUrl: checkoutSession.url };
  });
  
  // Step 5: Redirect to payment page
  redirect(transactionResult.checkoutUrl);
}
```

**What this does in simple terms:**
1. Checks if user is logged in
2. Prevents spam by rate limiting
3. Gets course information from database
4. Creates a payment customer in Stripe
5. Records the enrollment attempt
6. Creates a secure payment page
7. Redirects user to pay for the course

---

## 🎯 Summary

This codebase is structured with:

### **Clear Separation of Concerns**
- **UI Components**: Handle user interface
- **API Routes**: Handle business logic
- **Database Models**: Handle data storage
- **Middleware**: Handle security and routing

### **Modern Best Practices**
- **Type Safety**: TypeScript prevents errors
- **Security**: Multiple layers of protection
- **Performance**: Optimized for speed
- **Scalability**: Can handle growth

### **Developer-Friendly**
- **Clear naming conventions**
- **Modular architecture**
- **Comprehensive error handling**
- **Detailed documentation**

Each part of the system has a specific job, making it easy to understand, maintain, and extend.
