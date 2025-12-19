# 🎓 Masterji LMS - Complete Project Structure Guide

## 📖 What is This Project?

**Masterji** is a complete **Learning Management System (LMS)** - think of it like an online school or university platform where:
- **Teachers/Instructors** can create and manage online courses
- **Students** can browse, enroll in, and learn from these courses
- **Administrators** can oversee the entire platform

---

## 🏗️ How the Project is Organized

Think of this project like a **well-organized building** with different floors and rooms, each serving a specific purpose:

### 🏢 **Main Building Structure**

```
Masterji LMS Project/
├── 🏠 app/                    # The main application (like the main building)
├── 🧩 components/             # Reusable building blocks (like prefab rooms)
├── 📚 lib/                    # Utility tools and helpers (like the toolshed)
├── 🗄️ prisma/                # Database structure (like the building blueprints)
├── 🌐 public/                 # Public files (like the lobby/reception)
├── 📋 docs/                   # Documentation (like instruction manuals)
└── ⚙️ Configuration files     # Settings (like building codes and permits)
```

---

## 🏠 **The Main Application (`app/` folder)**

This is where all the **user-facing parts** of the website live. Think of it as different floors of a building:

### 🔐 **Authentication Floor (`(auth)/`)**
**What it does**: Handles user login and registration
- `login/` - The login page where users enter their credentials
- `verify-request/` - Email verification page (like checking ID at the door)
- `_components/LoginForm.tsx` - The actual login form users fill out

### 🌍 **Public Floor (`(public)/`)**
**What it does**: What visitors see BEFORE logging in
- `page.tsx` - The homepage/landing page (like the main entrance)
- `courses/` - Browse available courses (like a course catalog)
- `_components/` - Shared elements like navigation bar and user dropdown

### 👨‍💼 **Admin Floor (`admin/`)**
**What it does**: Where instructors/admins manage courses
- `courses/create/` - Create new courses (like setting up a new classroom)
- `courses/[courseId]/edit/` - Edit existing courses (like renovating a classroom)
- `courses/[courseId]/delete/` - Delete courses (like closing a classroom)
- `_components/` - Admin-specific tools and interfaces

### 📊 **Student Dashboard (`dashboard/`)**
**What it does**: Where students access their enrolled courses
- `[slug]/` - Individual course pages (like entering a specific classroom)
- `[lessonId]/` - Individual lesson pages (like a specific lecture)
- `_components/` - Student-specific tools like progress tracking

### 🔌 **API Floor (`api/`)**
**What it does**: The "behind-the-scenes" operations (like building utilities)
- `auth/` - Authentication services (like security system)
- `s3/` - File upload/download services (like document storage)
- `webhook/stripe/` - Payment processing (like the billing department)

### 📊 **Data Services (`data/`)**
**What it does**: Functions that fetch and organize information from the database
- `admin/` - Data functions for administrators
- `course/` - Data functions for course information
- `user/` - Data functions for user information

---

## 🧩 **Reusable Components (`components/` folder)**

Think of these as **pre-built room modules** that can be used anywhere in the building:

### 📁 **File Management (`file-uploader/`)**
- **Purpose**: Handles uploading images, videos, and documents
- **Like**: A universal filing cabinet system

### ✏️ **Text Editor (`rich-text-editor/`)**
- **Purpose**: Advanced text editing for course content
- **Like**: A sophisticated word processor built into the website

### 🧭 **Navigation (`sidebar/`)**
- **Purpose**: Navigation menus and site structure
- **Like**: Building directory and wayfinding signs

### 🎨 **UI Components (`ui/`)**
- **Purpose**: Basic building blocks (buttons, forms, dialogs)
- **Like**: Standard furniture and fixtures used throughout

---

## 📚 **Utility Library (`lib/` folder)**

This is like the **building's utility room** - essential services that keep everything running:

### 🔐 **Authentication (`auth.ts`, `auth-client.ts`)**
- **Purpose**: Manages user login/logout and security
- **Like**: The building's security system and key management

### 🗄️ **Database Connection (`db.ts`)**
- **Purpose**: Connects to and communicates with the database
- **Like**: The building's main electrical panel - connects everything

### 🌍 **External Services**
- `S3Client.ts` - File storage service (like cloud storage)
- `stripe.ts` - Payment processing (like the payment gateway)
- `resend.ts` - Email service (like the mail system)

### ✅ **Data Validation (`zodSchemas.ts`)**
- **Purpose**: Ensures data is correct and complete
- **Like**: Quality control inspector

---

## 🗄️ **Database Structure (`prisma/` folder)**

### 📋 **Schema (`schema.prisma`)**
This file defines the **database structure** - like architectural blueprints:

#### 👤 **User Table**
```
User Information Storage:
- Basic info: name, email, profile picture
- Account status: verified, banned, role
- Connections: courses created, enrollments, progress
```

#### 📚 **Course Table**
```
Course Information Storage:
- Course details: title, description, price, duration
- Organization: category, level (beginner/intermediate/advanced)
- Status: draft, published, archived
- Media: thumbnail image, course materials
```

#### 📖 **Chapter & Lesson Tables**
```
Course Content Organization:
- Chapters: Major course sections (like book chapters)
- Lessons: Individual learning units (like book pages)
- Structure: ordered sequence, multimedia content
```

#### 🎓 **Enrollment & Progress Tables**
```
Student Learning Tracking:
- Enrollments: who signed up for what course
- Progress: which lessons completed, overall progress
- Payments: enrollment fees and status
```

---

## 🔧 **Configuration Files (Root Level)**

### 📦 **Package Management**
- `package.json` - Lists all the tools and libraries needed (like a shopping list)
- `package-lock.json` - Exact versions of tools (like a detailed receipt)

### ⚙️ **Build & Development Settings**
- `next.config.js` - Main application settings
- `tsconfig.json` - TypeScript configuration (coding language rules)
- `tailwind.config.js` - Styling system configuration

### 🛡️ **Security & Middleware**
- `middleware.ts` - Security checkpoint (like building security)
- `.env` files - Secret keys and passwords (like a safe)

---

## 🔄 **How Everything Works Together**

### 1️⃣ **User Journey - Student**
```
1. Visit homepage (public/) → Browse courses
2. Register/Login (auth/) → Create account
3. Enroll in course → Payment processing (api/webhook/stripe/)
4. Access dashboard → View enrolled courses
5. Take lessons → Track progress in database
```

### 2️⃣ **User Journey - Instructor**
```
1. Login as admin (auth/) → Access admin panel
2. Create course (admin/courses/create/) → Fill course details
3. Add chapters/lessons → Structure course content
4. Upload materials (api/s3/) → Store files securely
5. Publish course → Make available to students
```

### 3️⃣ **Data Flow**
```
Frontend (User Interface) 
    ↕️ 
API Routes (Business Logic) 
    ↕️ 
Database (Data Storage)
    ↕️
External Services (Files, Payments, Emails)
```

---

## 🛠️ **Key Technologies Explained**

### **Next.js** - The Foundation
- **What it is**: A framework for building websites
- **Why it's used**: Makes websites fast and SEO-friendly
- **Like**: The building's foundation and structural framework

### **TypeScript** - The Language
- **What it is**: A programming language (enhanced JavaScript)
- **Why it's used**: Prevents errors and makes code more reliable
- **Like**: Using precise architectural drawings instead of sketches

### **Prisma** - Database Manager
- **What it is**: Tool for managing database
- **Why it's used**: Makes database operations safe and easy
- **Like**: A professional database administrator

### **Tailwind CSS** - Styling System
- **What it is**: System for making things look good
- **Why it's used**: Consistent, responsive design
- **Like**: An interior design system with pre-defined styles

---

## 🚀 **Getting Started (For Developers)**

### **Prerequisites**
1. Node.js (JavaScript runtime)
2. PostgreSQL (Database)
3. Git (Version control)

### **Setup Steps**
```bash
1. Clone the project: git clone [repository-url]
2. Install dependencies: npm install
3. Set up database: npx prisma migrate dev
4. Configure environment: Copy .env.example to .env
5. Start development: npm run dev
```

---

## 📈 **Project Features**

### ✅ **Completed Features**
- ✅ User authentication (login/register)
- ✅ Course creation and management
- ✅ File upload system
- ✅ Payment processing
- ✅ Student dashboard
- ✅ Progress tracking
- ✅ Responsive design

### 🔄 **Architecture Benefits**
- **Scalable**: Can handle growing number of users
- **Secure**: Multiple layers of security
- **Maintainable**: Well-organized code structure
- **Modern**: Uses latest web technologies

---

## 🎯 **Summary**

This project is a **complete online learning platform** built with modern web technologies. It's organized like a well-planned building where:

- **Each folder has a specific purpose**
- **Components are reusable and modular**
- **Security and performance are prioritized**
- **The structure supports easy maintenance and growth**

The codebase follows **industry best practices** and is designed to be **scalable, secure, and maintainable** for a production learning management system.
