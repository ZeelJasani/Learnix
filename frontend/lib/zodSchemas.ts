// ============================================================================
// Learnix LMS - Zod Validation Schemas (Zod વેલિડેશન સ્કીમા)
// ============================================================================
// Aa file frontend form validation schemas define kare chhe.
// This file defines frontend form validation schemas.
//
// Schemas / સ્કીમાઓ:
// - courseSchema: Course create/edit form validation
// - chapterSchema: Chapter create form validation
// - lessonSchema: Lesson create form validation
//
// Aa schemas form components ane server actions banne ma use thay chhe.
// These schemas are used in both form components and server actions.
// ============================================================================

import { z } from 'zod';

// Course difficulty levels / Course difficulty levels
export const courseLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;

// Course publication status / Course publication status
export const courseStatus = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

// Course categories ni list / List of course categories
export const courseCategories = [
    "Computer Science Fundamentals",
    "Data Structures & Algorithms",
    "Operating Systems",
    "Computer Networks",
    "Database Management Systems",
    "Software Engineering",
    "Web Development",
    "Mobile App Development",
    "Cloud Computing",
    "Cybersecurity",
    "Artificial Intelligence",
    "Machine Learning",
    "Deep Learning",
    "Data Science & Analytics",
    "Big Data Technologies",
    "Programming Languages",
    "DevOps & CI/CD",
    "Blockchain Development",
    "Internet of Things (IoT)",
    "Human-Computer Interaction",
    "Theory of Computation",
    "Compiler Design",
    "Parallel & Distributed Systems",
    "Virtualization & Containerization",
    "Computer Graphics & Vision",
    "Quantum Computing",
    "Embedded Systems",
    "Software Testing & Quality Assurance"
] as const;

// Course create/edit form validation schema
// Course create/edit form validation schema
export const courseSchema = z.object({
    title: z.string()
        .min(3, { message: "Title must be at least 3 characters long" })
        .max(100, { message: "Title must be at most 100 characters long" }),
    description: z.string()
        .min(3, { message: "Description must be at least 3 characters long" }),
    fileKey: z.string()
        .min(1, { message: "File is required" }),
    price: z.coerce.number()
        .min(0, { message: "Price must be a non-negative number" }),
    duration: z.coerce.number()
        .min(1, { message: "Duration must be at least 1 hour" })
        .max(500, { message: "Duration must be at most 500 hours" }),
    level: z.enum(courseLevels, { message: "Level is required" }),
    category: z.enum(courseCategories, { message: "Category is required" }),
    smallDescription: z.string()
        .min(3, { message: "Small description must be at least 3 characters" })
        .max(200, { message: "Small description must be at most 200 characters long" }),
    slug: z.string()
        .min(3, { message: "Slug must be at least 3 characters long" }),
    status: z.enum(courseStatus, { message: "Status is required" }),
});

// Chapter create form validation schema
// Chapter create form validation schema
export const chapterSchema = z.object({
    name: z.string().min(3, { message: "name must be at least 3 character long " }),
    courseId: z.string().min(1, { message: "invalid course id" }),
});

// Lesson create form validation schema
// Lesson create form validation schema
export const lessonSchema = z.object({
    name: z.string().min(3, { message: "name must be at least 3 character long " }),
    courseId: z.string().min(1, { message: "invalid course id" }),
    chapterId: z.string().min(1, { message: "invalid chapter id" }),
    description: z
        .string()
        .min(3, { message: "Description must be at least 3 characters long" }).optional(),
    thumbnail: z.string().optional(),
    videoKey: z.string().optional(),
})

// ============================================================================
// Inferred Types (ઇન્ફર્ડ ટાઇપ્સ)
// ============================================================================

// Course form data no type / Type for course form data
export type CourseSchemaType = z.infer<typeof courseSchema>;

// Chapter form data no type / Type for chapter form data
export type ChapterSchemaType = z.infer<typeof chapterSchema>;

// Lesson form data no type / Type for lesson form data
export type lessonSchemaType = z.infer<typeof lessonSchema>;