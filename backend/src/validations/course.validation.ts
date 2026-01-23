import { z } from 'zod';

export const courseLevels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const;
export const courseStatuses = ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const;

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
    stripePriceId: z.string().min(1, 'Stripe price ID is required'),
});

export const updateCourseSchema = createCourseSchema.partial();

export const courseIdParamSchema = z.object({
    id: z.string().min(1, 'Course ID is required'),
});

export const courseSlugParamSchema = z.object({
    slug: z.string().min(1, 'Slug is required'),
});
