// ============================================================================
// Learnix LMS - Course Validation Schemas (કોર્સ વેલિડેશન સ્કીમા)
// ============================================================================
// Aa file course-related request data validate karvani Zod schemas define kare chhe.
// This file defines Zod schemas for validating course-related request data.
//
// Schemas:
// - createCourseSchema  → Navo course create karva mate / For creating a new course
// - updateCourseSchema  → Course update karva mate (partial) / For updating a course (partial)
// - courseIdParamSchema  → Course ID param validate karva / For validating course ID param
// - courseSlugParamSchema → Course slug param validate karva / For validating course slug param
//
// Constants:
// - courseLevels     → BEGINNER | INTERMEDIATE | ADVANCED
// - courseStatuses    → DRAFT | PUBLISHED | ARCHIVED
// - courseCategories  → Available CS course categories
// ============================================================================

import { z } from 'zod';

// Course difficulty levels / કોર્સ ડિફિકલ્ટી લેવલ્સ
export const courseLevels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const;

// Course publish statuses / કોર્સ પબ્લિશ સ્ટેટસ
export const courseStatuses = ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const;

// Available course categories / ઉપલબ્ધ કોર્સ કેટેગરીઝ
export const courseCategories = [
    'Computer Science Fundamentals',
    'Data Structures & Algorithms',
    'Operating Systems',
    'Computer Networks',
    'Database Management Systems',
    'Software Engineering',
    'Web Development',
    'Mobile App Development',
    'Cloud Computing',
    'Cybersecurity',
    'Artificial Intelligence',
    'Machine Learning',
    'Deep Learning',
    'Data Science & Analytics',
    'Big Data Technologies',
    'Programming Languages',
    'DevOps & CI/CD',
    'Blockchain Development',
    'Internet of Things (IoT)',
    'Human-Computer Interaction',
    'Theory of Computation',
    'Compiler Design',
    'Parallel & Distributed Systems',
    'Virtualization & Containerization',
    'Computer Graphics & Vision',
    'Quantum Computing',
    'Embedded Systems',
    'Software Testing & Quality Assurance',
] as const;

// Navo course create karva mate validation schema
// Validation schema for creating a new course
export const createCourseSchema = z.object({
    title: z
        .string()
        .min(3, 'Title must be at least 3 characters')
        .max(100, 'Title must be at most 100 characters'),
    description: z
        .string()
        .min(3, 'Description must be at least 3 characters'),
    fileKey: z.string().min(1, 'File is required'),
    price: z.number().min(0, 'Price must be a positive number'),
    duration: z
        .number()
        .min(1, 'Duration must be at least 1 hour')
        .max(500, 'Duration must be at most 500 hours'),
    level: z.enum(courseLevels),
    category: z.enum(courseCategories),
    smallDescription: z
        .string()
        .min(3, 'Small description must be at least 3 characters')
        .max(200, 'Small description must be at most 200 characters'),
    slug: z.string().min(3, 'Slug must be at least 3 characters'),
    status: z.enum(courseStatuses).optional().default('DRAFT'),
});

// Course update mate partial schema (badha fields optional)
// Partial schema for course update (all fields optional)
export const updateCourseSchema = createCourseSchema.partial();

// Course ID parameter validation / કોર્સ ID પેરામીટર વેલિડેશન
export const courseIdParamSchema = z.object({
    id: z.string().min(1, 'Course ID is required'),
});

// Course slug parameter validation / કોર્સ slug પેરામીટર વેલિડેશન
export const courseSlugParamSchema = z.object({
    slug: z.string().min(1, 'Slug is required'),
});
