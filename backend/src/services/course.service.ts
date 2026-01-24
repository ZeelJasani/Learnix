import mongoose from 'mongoose';
import { Course, ICourse, CourseStatus } from '../models/Course';
import { Chapter } from '../models/Chapter';
import { Lesson } from '../models/Lesson';
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
        return Course.find({ status: 'PUBLISHED' })
            .sort({ createdAt: -1 })
            .select('title price smallDescription slug fileKey level duration category')
            .lean() as unknown as Promise<ICourse[]>;
    }

    /**
     * Get course by slug with chapters and lessons (public)
     */
    static async getBySlug(slug: string): Promise<any> {
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

                return {
                    ...chapter,
                    lessons,
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
        return Course.find()
            .sort({ createdAt: -1 })
            .select('title smallDescription duration level status price fileKey category slug')
            .lean() as unknown as Promise<ICourse[]>;
    }

    /**
     * Get course by ID with full details (admin)
     */
    static async getById(id: string): Promise<any> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw ApiError.badRequest('Invalid course ID');
        }

        const course = await Course.findById(id)
            .select('title description fileKey price duration level status slug smallDescription')
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
                    .select('title description thumbnailKey position videoKey')
                    .lean();

                return {
                    ...chapter,
                    lessons,
                };
            })
        );

        return {
            ...course,
            chapters: chaptersWithLessons,
        };
    }

    /**
     * Create a new course
     */
    static async create(data: CreateCourseData): Promise<ICourse> {
        // Check if slug already exists
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
     * Update a course
     */
    static async update(id: string, data: UpdateCourseData): Promise<ICourse | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw ApiError.badRequest('Invalid course ID');
        }

        // If updating slug, check for conflicts
        if (data.slug) {
            const existingCourse = await Course.findOne({
                slug: data.slug,
                _id: { $ne: id }
            });
            if (existingCourse) {
                throw ApiError.conflict('A course with this slug already exists');
            }
        }

        return Course.findByIdAndUpdate(id, data, { new: true });
    }

    /**
     * Delete a course and all related data
     */
    static async delete(id: string): Promise<boolean> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw ApiError.badRequest('Invalid course ID');
        }

        const course = await Course.findById(id);
        if (!course) {
            return false;
        }

        // Delete all chapters and lessons (cascade)
        const chapters = await Chapter.find({ courseId: id });
        for (const chapter of chapters) {
            await Lesson.deleteMany({ chapterId: chapter._id });
        }
        await Chapter.deleteMany({ courseId: id });
        await Course.findByIdAndDelete(id);

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
        return Course.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .select('title smallDescription duration level status price fileKey category slug createdAt')
            .lean() as unknown as Promise<ICourse[]>;
    }

    /**
     * Update course status
     */
    static async updateStatus(id: string, status: CourseStatus): Promise<ICourse | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw ApiError.badRequest('Invalid course ID');
        }

        return Course.findByIdAndUpdate(id, { status }, { new: true });
    }
}
