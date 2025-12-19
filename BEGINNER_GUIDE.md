# 🎓 Masterji LMS - Complete Beginner's Guide

## 👋 Welcome! What is This Project?

**Masterji** is a complete **online learning platform** (like Udemy or Coursera) where:

- 👨‍🏫 **Teachers** can create and sell online courses
- 👨‍🎓 **Students** can browse, buy, and learn from courses  
- 👨‍💼 **Administrators** can manage the entire platform

Think of it as **building a digital university** with classrooms, enrollment systems, payment processing, and student tracking - all in one web application!

---

## 🏗️ How is This Project Built?

### 🧱 **The Building Blocks**

Imagine building a house. You need:
- **Foundation** (Next.js) - The base framework
- **Rooms** (React Components) - Individual parts of the website  
- **Plumbing** (Database) - How data flows through the system
- **Electrical** (APIs) - How different parts communicate
- **Security System** (Authentication) - Who can access what
- **Payment System** (Stripe) - How money is processed

### 🎨 **The Technologies Used**

| Technology | What It Does | Real-World Analogy |
|------------|--------------|-------------------|
| **Next.js** | Main framework for building the website | The architectural blueprint |
| **React** | Creates interactive user interfaces | The interior design and furniture |
| **TypeScript** | Programming language (safer JavaScript) | Quality control inspector |
| **PostgreSQL** | Database that stores all information | The filing system and records |
| **Prisma** | Tool to communicate with database | The librarian who organizes files |
| **Tailwind CSS** | Makes everything look beautiful | The paint and decorations |
| **Stripe** | Handles payments securely | The bank and payment processor |
| **AWS S3** | Stores files (images, videos) | The storage warehouse |

---

## 📁 **Project Structure Explained Simply**

### 🏢 **Think of it as a Multi-Story Building**

```
🏢 Masterji LMS Building
│
├── 🏠 Ground Floor (app/) - Main Application
│   ├── 🚪 Entrance (public pages) - What visitors see first
│   ├── 🔐 Security Desk (auth) - Login and registration  
│   ├── 👨‍💼 Admin Office (admin) - Management area
│   ├── 🎓 Classrooms (dashboard) - Where learning happens
│   └── 🔌 Utilities (api) - Behind-the-scenes operations
│
├── 🧩 Component Warehouse (components/) - Reusable parts
├── 🛠️ Tool Shed (lib/) - Utility tools and configurations
├── 📋 Blueprints (prisma/) - Database structure plans
├── 🌐 Public Storage (public/) - Images and static files
└── 📚 Documentation (docs/) - Instruction manuals
```

### 🎯 **What Each Folder Does**

#### 🏠 **`app/` - The Main Application**
This is where users actually interact with your website:

- **`(public)/`** - Homepage, course browsing (like a store front)
- **`(auth)/`** - Login, registration (like the membership desk)
- **`admin/`** - Course creation, management (like the teacher's lounge)
- **`dashboard/`** - Student learning area (like individual study rooms)
- **`api/`** - Server functions (like the building's utilities)

#### 🧩 **`components/` - Reusable Building Blocks**
Pre-built parts used throughout the site:

- **`ui/`** - Basic elements (buttons, forms, cards)
- **`file-uploader/`** - File upload system
- **`rich-text-editor/`** - Advanced text editing
- **`sidebar/`** - Navigation menus

#### 🛠️ **`lib/` - Configuration & Utilities**
The "engine room" that makes everything work:

- **`auth.ts`** - User login system
- **`db.ts`** - Database connection
- **`stripe.ts`** - Payment processing
- **`S3Client.ts`** - File storage

---

## 🔄 **How Everything Works Together**

### 📖 **User Stories**

#### 🎓 **As a Student:**
1. **Visit Homepage** → Browse available courses
2. **Create Account** → Register with email or GitHub
3. **Choose Course** → View course details and price
4. **Make Payment** → Secure checkout with Stripe
5. **Access Course** → Learn through organized lessons
6. **Track Progress** → See completion status

#### 👨‍🏫 **As an Instructor:**
1. **Admin Login** → Access admin dashboard
2. **Create Course** → Add title, description, pricing
3. **Structure Content** → Organize into chapters and lessons
4. **Upload Materials** → Add videos, images, documents
5. **Publish Course** → Make available to students
6. **Monitor Enrollments** → Track student progress

### 🔄 **Data Flow Example**

When a student enrolls in a course:

```
1. Student clicks "Enroll" button
   ↓
2. System checks if user is logged in
   ↓
3. Creates payment session with Stripe
   ↓
4. Student completes payment
   ↓
5. Stripe sends confirmation webhook
   ↓
6. System creates enrollment record in database
   ↓
7. Student gets access to course content
```

---

## 🗄️ **Database Structure Simplified**

Think of the database as a **digital filing cabinet** with different drawers:

### 📂 **Main File Drawers**

#### 👤 **Users Drawer**
Stores information about everyone using the platform:
- Name, email, profile picture
- Account type (student, instructor, admin)
- Login sessions and security info

#### 📚 **Courses Drawer**  
Contains all course information:
- Course title, description, price
- Instructor who created it
- Category, difficulty level
- Publication status

#### 📖 **Lessons Drawer**
Individual learning content:
- Lesson title and content
- Video files, images, documents
- Order within the course

#### 🎓 **Enrollments Drawer**
Tracks who signed up for what:
- Which student enrolled in which course
- Payment amount and status
- Enrollment date

#### 📊 **Progress Drawer**
Student learning progress:
- Which lessons completed
- Completion dates
- Overall course progress percentage

---

## 🔐 **Security & Authentication**

### 🛡️ **How Security Works**

1. **User Registration**
   - Email verification required
   - Secure password storage
   - Optional social login (GitHub)

2. **Session Management**
   - Secure login sessions
   - Automatic logout after inactivity
   - Remember me functionality

3. **Access Control**
   - Students can only access enrolled courses
   - Instructors can only edit their own courses
   - Admins have full platform access

4. **Payment Security**
   - Stripe handles all payment processing
   - No credit card data stored locally
   - PCI compliance through Stripe

---

## 💻 **For Developers: Getting Started**

### 🚀 **Prerequisites**
Before you can run this project, you need:

1. **Node.js** (v18 or higher) - JavaScript runtime
2. **PostgreSQL** - Database system
3. **Git** - Version control
4. **Code Editor** (VS Code recommended)

### 📦 **Installation Steps**

```bash
# 1. Clone the project
git clone [your-repository-url]
cd Mastrji-Final-Year-Project

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your database URL and API keys

# 4. Set up database
npx prisma migrate dev
npx prisma generate

# 5. Start development server
npm run dev
```

### 🔧 **Environment Variables Needed**

Create a `.env` file with these variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/masterji"

# Authentication
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"
AUTH_GITHUB_CLIENT_ID="your-github-app-id"
AUTH_GITHUB_SECRET="your-github-app-secret"

# Email Service
RESEND_API_KEY="your-resend-api-key"

# File Storage
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_ENDPOINT_URL_S3="your-s3-endpoint"
AWS_REGION="your-aws-region"

# Payment Processing
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"

# Security
ARCJET_KEY="your-arcjet-api-key"
```

---

## 🎯 **Key Features**

### ✅ **What This Platform Can Do**

#### 👨‍🎓 **For Students**
- Browse and search courses
- Secure enrollment and payment
- Progress tracking
- Mobile-responsive learning
- Course completion certificates

#### 👨‍🏫 **For Instructors**
- Drag-and-drop course builder
- Rich text editor for content
- File upload for videos/images
- Student progress monitoring
- Revenue tracking

#### 👨‍💼 **For Administrators**
- User management
- Course approval system
- Payment monitoring
- Platform analytics
- Content moderation

### 🚀 **Technical Features**
- **Fast Performance** - Optimized loading times
- **SEO Friendly** - Good search engine visibility
- **Mobile Responsive** - Works on all devices
- **Secure** - Multiple layers of security
- **Scalable** - Can handle growing user base

---

## 🔍 **Understanding the Code**

### 📝 **File Naming Conventions**

- **`page.tsx`** - Main page component (what users see)
- **`layout.tsx`** - Wrapper that surrounds pages
- **`actions.ts`** - Server-side functions
- **`_components/`** - Components private to that route
- **`[slug]/`** - Dynamic routes (variable URLs)

### 🎨 **Component Structure**

```typescript
// Example: A simple course card component
function CourseCard({ course }) {
  return (
    <div className="course-card">
      <img src={course.thumbnail} alt={course.title} />
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <span>${course.price}</span>
      <button>Enroll Now</button>
    </div>
  );
}
```

### 🔄 **API Structure**

```typescript
// Example: Enrollment API endpoint
export async function POST(request) {
  // 1. Get user information
  const user = await getCurrentUser();
  
  // 2. Validate request data
  const { courseId } = await request.json();
  
  // 3. Process enrollment
  const enrollment = await createEnrollment(user.id, courseId);
  
  // 4. Return response
  return Response.json({ success: true, enrollment });
}
```

---

## 🎓 **Learning Path**

### 🥉 **Beginner Level**
1. Understand the project structure
2. Learn about React components
3. Explore the database schema
4. Make simple UI changes

### 🥈 **Intermediate Level**
1. Add new components
2. Create new API endpoints
3. Modify database schema
4. Implement new features

### 🥇 **Advanced Level**
1. Optimize performance
2. Add advanced security features
3. Implement real-time features
4. Scale for production

---

## 🤝 **Contributing**

### 🛠️ **How to Contribute**

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

### 📋 **Code Standards**
- Use TypeScript for type safety
- Follow existing naming conventions
- Add comments for complex logic
- Write tests for new features
- Ensure responsive design

---

## 🎉 **Conclusion**

This **Masterji LMS** project is a complete, production-ready learning management system that demonstrates:

- **Modern web development practices**
- **Scalable architecture**
- **Security best practices**
- **User-friendly design**
- **Professional code organization**

Whether you're a student learning web development or a developer looking to understand a complete application, this project provides an excellent example of how to build a real-world web application with modern technologies.

---

## 📚 **Additional Resources**

- **[PROJECT_STRUCTURE_GUIDE.md](./PROJECT_STRUCTURE_GUIDE.md)** - Detailed folder structure
- **[DETAILED_CODE_EXPLANATIONS.md](./DETAILED_CODE_EXPLANATIONS.md)** - Code deep dive
- **[VISUAL_PROJECT_MAP.md](./VISUAL_PROJECT_MAP.md)** - Visual project overview
- **[docs/diagrams/](./docs/diagrams/)** - System architecture diagrams

Happy coding! 🚀
