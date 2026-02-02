import mongoose from 'mongoose';
import { Course, ICourse, CourseStatus } from '../models/Course';
import { Chapter } from '../models/Chapter';
import { Lesson } from '../models/Lesson';
import { LessonProgress } from '../models/LessonProgress';
import { ApiError } from '../utils/apiError';

interface CreateCourseData {
    title: string;
    description: string;
    fileKey: string;
    price: number;
    duration: number;
    level: string;
    category: string;
    smallDescription: string;
    slug: string;
    status?: string;
    stripePriceId: string;
    userId: string;
}

interface UpdateCourseData {
    title?: string;
    description?: string;
    fileKey?: string;
    price?: number;
    duration?: number;
    level?: string;
    category?: string;
    smallDescription?: string;
    slug?: string;
    status?: string;
    stripePriceId?: string;
}

export class CourseService {
    /**
     * Get all published courses (public)
     */
    static async getAllPublished(): Promise<ICourse[]> {
        const courses = await Course.find({ status: 'PUBLISHED' })
            .sort({ createdAt: -1 })
            .select('title price smallDescription slug fileKey level duration category userId')
            .populate('userId', 'name image')
            .lean();

        // Get chapter counts for all courses
        const coursesWithChapterCount = await Promise.all(
            courses.map(async (course) => {
                const chapterCount = await Chapter.countDocuments({ courseId: course._id });
                return {
                    ...course,
                    id: course._id.toString(),
                    chapterCount,
                    mentor: course.userId ? {
                        id: (course.userId as any)._id.toString(),
                        name: (course.userId as any).name,
                        image: (course.userId as any).image,
                    } : null,
                };
            })
        );

        return coursesWithChapterCount as unknown as Promise<ICourse[]>;
    }

    /**
     * Get course by slug with chapters and lessons (public)
     */
    static async getBySlug(slug: string, userId?: string): Promise<any> {
        const query = mongoose.Types.ObjectId.isValid(slug)
            ? { $or: [{ _id: slug }, { slug }], status: 'PUBLISHED' }
            : { slug, status: 'PUBLISHED' };

        const course = await Course.findOne(query)
            .select('title description fileKey price duration level category smallDescription slug stripePriceId')
            .lean();

        if (!course) {
            return null;
        }

        // Get chapters with lessons
        const chapters = await Chapter.find({ courseId: course._id })
            .sort({ position: 1 })
            .select('title position')
            .lean();

        const chaptersWithLessons = await Promise.all(
            chapters.map(async (chapter) => {
                const lessons = await Lesson.find({ chapterId: chapter._id })
                    .sort({ position: 1 })
                    .select('title position')
                    .lean();

                let lessonsWithProgress = lessons.map(lesson => ({
                    ...lesson,
                    lessonProgress: [] as any[]
                }));

                if (userId) {
                    const lessonIds = lessons.map(l => l._id);
                    const progressDocs = await LessonProgress.find({
                        userId: new mongoose.Types.ObjectId(userId),
                        lessonId: { $in: lessonIds }
                    }).lean();

                    lessonsWithProgress = lessons.map(lesson => {
                        const progress = progressDocs.find(p => p.lessonId.toString() === lesson._id.toString());
                        return {
                            ...lesson,
                            lessonProgress: progress ? [{
                                completed: progress.completed,
                                lessonId: lesson._id.toString(),
                                id: progress._id.toString()
                            }] : []
                        };
                    });
                }

                return {
                    ...chapter,
                    id: chapter._id.toString(),
                    lessons: lessonsWithProgress.map(lesson => ({
                        ...lesson,
                        id: lesson._id.toString(),
                    })),
                };
            })
        );

        return {
            ...course,
            id: course._id.toString(),
            chapters: chaptersWithLessons,
        };
    }

    /**
     * Get all courses (admin)
     */
    static async getAll(): Promise<ICourse[]> {
        const courses = await Course.find()
            .sort({ createdAt: -1 })
            .select('title smallDescription duration level status price fileKey category slug userId')
            .populate('userId', 'name image')
            .lean();

        // Get chapter counts for all courses
        const coursesWithChapterCount = await Promise.all(
            courses.map(async (course) => {
                const chapterCount = await Chapter.countDocuments({ courseId: course._id });
                return {
                    ...course,
                    id: course._id.toString(),
                    chapterCount,
                    mentor: course.userId ? {
                        id: (course.userId as any)._id.toString(),
                        name: (course.userId as any).name,
                        image: (course.userId as any).image,
                    } : null,
                };
            })
        );

        return coursesWithChapterCount as unknown as Promise<ICourse[]>;
    }

    /**
     * Get course by ID or slug with full details (admin)
     */
    static async getById(idOrSlug: string): Promise<any> {
        let course;

        if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
            course = await Course.findById(idOrSlug)
                .select('title description fileKey price duration level status slug smallDescription')
                .lean();
        }

        if (!course) {
            course = await Course.findOne({ slug: idOrSlug })
                .select('title description fileKey price duration level status slug smallDescription')
                .lean();
        }

        if (!course) {
            return null;
        }

        // Get chapters with lessons
        const chapters = await Chapter.find({ courseId: course._id })
            .sort({ position: 1 })
            .select('title position')
            .lean();

        const chaptersWithLessons = await Promise.all(
            chapters.map(async (chapter) => {
                const lessons = await Lesson.find({ chapterId: chapter._id })
                    .sort({ position: 1 })
                    .select('title description thumbnailKey position videoKey')
                    .lean();

                return {
                    ...chapter,
                    id: chapter._id.toString(),
                    lessons: lessons.map(lesson => ({
                        ...lesson,
                        id: lesson._id.toString(),
                    })),
                };
            })
        );

        return {
            ...course,
            id: course._id.toString(),
            chapters: chaptersWithLessons,
        };
    }

    /**
     * Create a new course
     */
    static async create(data: CreateCourseData): Promise<ICourse> {
        const existingCourse = await Course.findOne({ slug: data.slug });
        if (existingCourse) {
            throw ApiError.conflict('A course with this slug already exists');
        }

        // Import env dynamically to ensure it's loaded
        const { env } = await import('../config/env');

        // Construct image URL
        const imageUrl = `https://${env.S3_BUCKET_NAME}.t3.storageapi.dev/${data.fileKey}`;

        // Create Stripe Product
        const { StripeService } = await import('./stripe.service');
        const plainDescription = CourseService.getTextFromDescription(data.description);
        const stripeProduct = await StripeService.createProduct(
            data.title,
            plainDescription,
            imageUrl
        );

        // Create Stripe Price
        const stripePrice = await StripeService.createPrice(stripeProduct.id, data.price * 100);

        const course = new Course({
            ...data,
            stripeProductId: stripeProduct.id,
            stripePriceId: stripePrice.id,
            userId: new mongoose.Types.ObjectId(data.userId),
        });

        await course.save();
        return course;
    }

    /**
     * Update a course by ID or slug
     */
    static async update(idOrSlug: string, data: UpdateCourseData): Promise<ICourse | null> {
        // Import locally
        const { resolveCourseId } = await import('../utils/id-resolver');
        const { StripeService } = await import('./stripe.service');
        const { env } = await import('../config/env');

        let courseId: string;
        try {
            courseId = await resolveCourseId(idOrSlug);
        } catch (error) {
            return null;
        }

        // Check for slug conflict if changing slug
        if (data.slug) {
            const existingCourse = await Course.findOne({
                slug: data.slug,
                _id: { $ne: courseId }
            });
            if (existingCourse) {
                throw ApiError.conflict('A course with this slug already exists');
            }
        }

        // Get current course to access stripeProductId
        const currentCourse = await Course.findById(courseId);
        if (!currentCourse) return null;

        const updateData: any = { ...data };

        // Handle Stripe updates

        // 1. If Price changes, create new Stripe Price
        if (data.price !== undefined && data.price !== currentCourse.price) {
            const newPrice = await StripeService.createPrice(currentCourse.stripeProductId, data.price * 100);
            updateData.stripePriceId = newPrice.id;

            // Also update default price on product
            await StripeService.updateProduct(currentCourse.stripeProductId, {
                default_price: newPrice.id
            });
        }

        // Helper to extract text from TipTap JSON
        const getTextFromDescription = (desc: string): string => {
            try {
                // Check if it looks like JSON object starting with { "type": "doc"
                if (desc.trim().startsWith('{') && desc.includes('"type":"doc"')) {
                    const json = JSON.parse(desc);
                    let text = '';

                    // Simple recursive extractor
                    const extract = (node: any) => {
                        if (node.text) text += node.text;
                        if (node.content && Array.isArray(node.content)) {
                            node.content.forEach(extract);
                        }
                    };

                    extract(json);
                    return text || desc;
                }
                return desc;
            } catch (e) {
                return desc;
            }
        };

        // 2. If details change, update Stripe Product
        if (data.title || data.description || data.fileKey) {
            const imageUrl = data.fileKey
                ? `https://${env.S3_BUCKET_NAME}.t3.storageapi.dev/${data.fileKey}`
                : undefined;

            const plainDescription = data.description ? CourseService.getTextFromDescription(data.description) : undefined;

            await StripeService.updateProduct(currentCourse.stripeProductId, {
                name: data.title,
                description: plainDescription,
                image: imageUrl
            });
        }

        return Course.findByIdAndUpdate(courseId, updateData, { new: true });
    }

    /**
     * Delete a course and all related data by ID or slug
     */
    static async delete(idOrSlug: string): Promise<boolean> {
        const { resolveCourseId } = await import('../utils/id-resolver');
        let courseId: string;
        try {
            courseId = await resolveCourseId(idOrSlug);
        } catch (error) {
            return false;
        }

        // Delete all chapters and lessons (cascade)
        const chapters = await Chapter.find({ courseId });
        for (const chapter of chapters) {
            await Lesson.deleteMany({ chapterId: chapter._id });
        }
        await Chapter.deleteMany({ courseId });
        await Course.findByIdAndDelete(courseId);

        return true;
    }

    /**
     * Search courses
     */
    static async search(query: string, category?: string): Promise<ICourse[]> {
        const searchFilter: any = {
            status: 'PUBLISHED',
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { smallDescription: { $regex: query, $options: 'i' } },
            ],
        };

        if (category) {
            searchFilter.category = category;
        }

        const courses = await Course.find(searchFilter)
            .sort({ createdAt: -1 })
            .select('title price smallDescription slug fileKey level duration category userId')
            .populate('userId', 'name image')
            .lean();

        const coursesWithMentor = await Promise.all(courses.map(async (course) => {
            return {
                ...course,
                mentor: course.userId ? {
                    id: (course.userId as any)._id.toString(),
                    name: (course.userId as any).name,
                    image: (course.userId as any).image,
                } : null,
            };
        }));

        return coursesWithMentor as unknown as Promise<ICourse[]>;
    }

    /**
     * Get recent courses (admin)
     */
    static async getRecent(limit = 5): Promise<ICourse[]> {
        const courses = await Course.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .select('title smallDescription duration level status price fileKey category slug createdAt userId')
            .populate('userId', 'name image')
            .lean();

        const coursesWithChapterCount = await Promise.all(
            courses.map(async (course) => {
                const chapterCount = await Chapter.countDocuments({ courseId: course._id });
                return {
                    ...course,
                    id: course._id.toString(),
                    chapterCount,
                    mentor: course.userId ? {
                        id: (course.userId as any)._id.toString(),
                        name: (course.userId as any).name,
                        image: (course.userId as any).image,
                    } : null,
                };
            })
        );

        return coursesWithChapterCount as unknown as Promise<ICourse[]>;
    }

    /**
     * Update course status
     */
    static async updateStatus(idOrSlug: string, status: CourseStatus): Promise<ICourse | null> {
        const { resolveCourseId } = await import('../utils/id-resolver');
        let courseId: string;
        try {
            courseId = await resolveCourseId(idOrSlug);
        } catch (error) {
            return null;
        }

        return Course.findByIdAndUpdate(courseId, { status }, { new: true });
    }

    /**
     * Helper to extract text from TipTap JSON
     */
    private static getTextFromDescription(desc: string): string {
        try {
            // Check if it looks like JSON object starting with { "type": "doc"
            if (desc && desc.trim().startsWith('{') && desc.includes('"type":"doc"')) {
                const json = JSON.parse(desc);
                let text = '';

                // Simple recursive extractor
                const extract = (node: any) => {
                    if (node.text) text += node.text;
                    if (node.content && Array.isArray(node.content)) {
                        node.content.forEach(extract);
                    }
                };

                extract(json);
                return text || desc;
            }
            return desc;
        } catch (e) {
            return desc;
        }
    }
}
