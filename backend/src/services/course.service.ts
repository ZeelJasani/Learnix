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

    static async getAllPublished(): Promise<ICourse[]> {
        const courses = await Course.find({ status: 'PUBLISHED' })
            .sort({ createdAt: -1 })
            .select('title price smallDescription slug fileKey level duration category userId')
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


    static async getAll(): Promise<ICourse[]> {
        const courses = await Course.find()
            .sort({ createdAt: -1 })
            .select('title smallDescription duration level status price fileKey category slug userId')
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


    static async create(data: CreateCourseData): Promise<ICourse> {
        const existingCourse = await Course.findOne({ slug: data.slug });
        if (existingCourse) {
            throw ApiError.conflict('A course with this slug already exists');
        }


        const { env } = await import('../config/env');


        const imageUrl = `https://${env.S3_BUCKET_NAME}.t3.storageapi.dev/${data.fileKey}`;

        console.log('CourseService.create called with:', JSON.stringify(data, null, 2));

        let stripeProductId: string;
        let stripePriceId: string;

        if (data.price === 0) {
            console.log('Creating FREE course. Generating dummy IDs.');
            const dummyId = new mongoose.Types.ObjectId().toString();
            stripeProductId = `free_prod_${dummyId}`;
            stripePriceId = `free_price_${dummyId}`;
            console.log('Generated IDs:', { stripeProductId, stripePriceId });
        } else {
            console.log('Creating PAID course. Calling Stripe.');

            const { StripeService } = await import('./stripe.service');
            const plainDescription = CourseService.getTextFromDescription(data.description);
            const stripeProduct = await StripeService.createProduct(
                data.title,
                plainDescription,
                imageUrl
            );
            stripeProductId = stripeProduct.id;

            const stripePrice = await StripeService.createPrice(stripeProduct.id, Math.round(data.price * 100));
            stripePriceId = stripePrice.id;
        }

        const course = new Course({
            ...data,
            stripeProductId,
            stripePriceId,
            userId: new mongoose.Types.ObjectId(data.userId),
        });

        await course.save();
        return course;
    }


    static async update(idOrSlug: string, data: UpdateCourseData): Promise<ICourse | null> {

        const { resolveCourseId } = await import('../utils/id-resolver');
        const { env } = await import('../config/env');

        let courseId: string;
        try {
            courseId = await resolveCourseId(idOrSlug);
        } catch (error) {
            return null;
        }


        if (data.slug) {
            const existingCourse = await Course.findOne({
                slug: data.slug,
                _id: { $ne: courseId }
            });
            if (existingCourse) {
                throw ApiError.conflict('A course with this slug already exists');
            }
        }


        const currentCourse = await Course.findById(courseId);
        if (!currentCourse) return null;

        const updateData: any = { ...data };


        if (data.price !== undefined && data.price !== currentCourse.price) {
            if (data.price === 0) {
                const dummyId = new mongoose.Types.ObjectId().toString();
                updateData.stripeProductId = `free_prod_${dummyId}`;
                updateData.stripePriceId = `free_price_${dummyId}`;
            } else {
                const { StripeService } = await import('./stripe.service');
                const wasFree = currentCourse.price === 0 || currentCourse.stripeProductId?.startsWith('free_');

                if (wasFree) {
                    const imageUrl = (data.fileKey || currentCourse.fileKey)
                        ? `https://${env.S3_BUCKET_NAME}.t3.storageapi.dev/${data.fileKey || currentCourse.fileKey}`
                        : undefined;

                    const descToUse = data.description || currentCourse.description;
                    const plainDescription = descToUse ? CourseService.getTextFromDescription(descToUse) : '';

                    const stripeProduct = await StripeService.createProduct(
                        data.title || currentCourse.title,
                        plainDescription,
                        imageUrl
                    );
                    updateData.stripeProductId = stripeProduct.id;
                    const newPrice = await StripeService.createPrice(stripeProduct.id, Math.round(data.price * 100));
                    updateData.stripePriceId = newPrice.id;
                } else {
                    const newPrice = await StripeService.createPrice(currentCourse.stripeProductId, Math.round(data.price * 100));
                    updateData.stripePriceId = newPrice.id;

                    await StripeService.updateProduct(currentCourse.stripeProductId, {
                        default_price: newPrice.id
                    });
                }
            }
        }

        if ((data.title || data.description || data.fileKey) &&
            currentCourse.price !== 0 &&
            !currentCourse.stripeProductId?.startsWith('free_') &&
            (data.price === undefined || data.price !== 0)
        ) {
            const { StripeService } = await import('./stripe.service');
            const imageUrl = data.fileKey
                ? `https://${env.S3_BUCKET_NAME}.t3.storageapi.dev/${data.fileKey}`
                : undefined;

            const plainDescription = data.description ? CourseService.getTextFromDescription(data.description) : undefined;

            if (!updateData.stripeProductId) {
                await StripeService.updateProduct(currentCourse.stripeProductId, {
                    name: data.title,
                    description: plainDescription,
                    image: imageUrl
                });
            }
        }

        return Course.findByIdAndUpdate(courseId, updateData, { new: true });
    }

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

    private static getTextFromDescription(desc: string): string {
        try {
            if (desc && desc.trim().startsWith('{') && desc.includes('"type":"doc"')) {
                const json = JSON.parse(desc);
                let text = '';

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
