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
            .select('title price smallDescription slug fileKey level duration category')
            .lean();

        // Get chapter counts for all courses
        const coursesWithChapterCount = await Promise.all(
            courses.map(async (course) => {
                const chapterCount = await Chapter.countDocuments({ courseId: course._id });
                return {
                    ...course,
                    id: course._id.toString(),
                    chapterCount,
                };
            })
        );

        return coursesWithChapterCount as unknown as Promise<ICourse[]>;
    }

    /**
     * Get course by slug with chapters and lessons (public)
     */
    static async getBySlug(slug: string, userId?: string): Promise<any> {
        const course = await Course.findOne({ slug, status: 'PUBLISHED' })
            .select('title description fileKey price duration level category smallDescription slug')
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
                    lessons: lessonsWithProgress,
                };
            })
        );

        return {
            ...course,
            chapters: chaptersWithLessons,
        };
    }

    /**
     * Get all courses (admin)
     */
    static async getAll(): Promise<ICourse[]> {
        const courses = await Course.find()
            .sort({ createdAt: -1 })
            .select('title smallDescription duration level status price fileKey category slug')
            .lean();

        // Get chapter counts for all courses
        const coursesWithChapterCount = await Promise.all(
            courses.map(async (course) => {
                const chapterCount = await Chapter.countDocuments({ courseId: course._id });
                return {
                    ...course,
                    id: course._id.toString(),
                    chapterCount,
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

        const course = new Course({
            ...data,
            userId: new mongoose.Types.ObjectId(data.userId),
        });

        await course.save();
        return course;
    }

    /**
     * Update a course by ID or slug
     */
    static async update(idOrSlug: string, data: UpdateCourseData): Promise<ICourse | null> {
        // Import locally to avoid circular dependency if any (though utils is safe)
        const { resolveCourseId } = await import('../utils/id-resolver');
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

        return Course.findByIdAndUpdate(courseId, data, { new: true });
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

        return Course.find(searchFilter)
            .sort({ createdAt: -1 })
            .select('title price smallDescription slug fileKey level duration category')
            .lean() as unknown as Promise<ICourse[]>;
    }

    /**
     * Get recent courses (admin)
     */
    static async getRecent(limit = 5): Promise<ICourse[]> {
        const courses = await Course.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .select('title smallDescription duration level status price fileKey category slug createdAt')
            .lean();

        const coursesWithChapterCount = await Promise.all(
            courses.map(async (course) => {
                const chapterCount = await Chapter.countDocuments({ courseId: course._id });
                return {
                    ...course,
                    id: course._id.toString(),
                    chapterCount,
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
}
