/**
 * Lesson Service / Lesson Service
 *
 * Aa service chapter ni andar na lessons nu CRUD ane content access handle kare chhe.
 * This service handles CRUD and content access for lessons within chapters.
 *
 * Features / Features:
 * - Auto-position: Navo lesson last position par create thay chhe
 * - Enrollment check: Content access mate enrollment verification
 * - Progress tracking: User ni lesson progress sathe content return thay
 * - Cascade delete: Lesson delete karta progress pan delete thay
 * - Reorder: Drag-and-drop mate bulkWrite operation use thay chhe
 */
import mongoose from 'mongoose';
import { Lesson, ILesson } from '../models/Lesson';
import { Chapter } from '../models/Chapter';
import { Enrollment } from '../models/Enrollment';
import { LessonProgress } from '../models/LessonProgress';
import { ApiError } from '../utils/apiError';

interface CreateLessonData {
    title: string;
    chapterId: string;
    description?: string;
    thumbnailKey?: string;
    videoKey?: string;
}

interface UpdateLessonData {
    title?: string;
    description?: string;
    thumbnailKey?: string;
    videoKey?: string;
    position?: number;
}

interface ReorderLessonData {
    id: string;
    position: number;
}

export class LessonService {
    // Chapter na badha lessons position pramane sorted return karo
    // Get all lessons for a chapter sorted by position
    static async getByChapterId(chapterId: string): Promise<ILesson[]> {
        return Lesson.find({ chapterId })
            .sort({ position: 1 })
            .lean() as unknown as ILesson[];
    }

    // ID thi lesson shodhvo / Get lesson by ID
    static async getById(id: string): Promise<ILesson | null> {
        return Lesson.findById(id);
    }

    // Enrolled user mate lesson content ane progress return karo
    // Get lesson content with progress for enrolled user
    static async getContentForUser(lessonId: string, userId: string): Promise<any> {
        const lesson = await Lesson.findById(lessonId)
            .select('title description thumbnailKey videoKey position chapterId')
            .lean();

        if (!lesson) {
            throw ApiError.notFound('Lesson not found');
        }

        const chapter = await Chapter.findById(lesson.chapterId)
            .select('courseId')
            .populate({ path: 'courseId', select: 'slug' })
            .lean();

        if (!chapter) {
            throw ApiError.notFound('Chapter not found');
        }

        const enrollment = await Enrollment.findOne({
            userId: new mongoose.Types.ObjectId(userId),
            courseId: chapter.courseId,
            status: 'Active',
        });

        if (!enrollment) {
            throw ApiError.forbidden('You must be enrolled in this course');
        }

        const progress = await LessonProgress.findOne({
            userId: new mongoose.Types.ObjectId(userId),
            lessonId: new mongoose.Types.ObjectId(lessonId),
        }).select('completed');

        return {
            ...lesson,
            lessonProgress: progress ? [{ completed: progress.completed, lessonId }] : [],
            Chapter: {
                courseId: chapter.courseId,
                Course: { slug: (chapter.courseId as any).slug },
            },
        };
    }

    // Navo lesson create karo - position auto-calculate thay chhe
    // Create a new lesson - position is auto-calculated
    static async create(data: CreateLessonData): Promise<ILesson> {
        // Get the next position
        const lastLesson = await Lesson.findOne({ chapterId: data.chapterId })
            .sort({ position: -1 })
            .select('position');

        const position = lastLesson ? lastLesson.position + 1 : 0;

        // Create and save lesson
        const lesson = new Lesson({
            title: data.title,
            chapterId: new mongoose.Types.ObjectId(data.chapterId),
            description: data.description || null,
            thumbnailKey: data.thumbnailKey || null,
            videoKey: data.videoKey || null,
            position,
        });

        await lesson.save();
        return lesson;
    }

    // Lesson update karo / Update a lesson
    static async update(id: string, data: UpdateLessonData): Promise<ILesson | null> {
        return Lesson.findByIdAndUpdate(id, data, { new: true });
    }

    // Lesson ane teni progress delete karo (cascade delete)
    // Delete a lesson and its progress records (cascade delete)
    static async delete(id: string): Promise<boolean> {
        const lesson = await Lesson.findById(id);
        if (!lesson) return false;

        // Delete lesson progress
        await LessonProgress.deleteMany({ lessonId: id });
        await Lesson.findByIdAndDelete(id);

        // Reorder remaining lessons
        await Lesson.updateMany(
            { chapterId: lesson.chapterId, position: { $gt: lesson.position } },
            { $inc: { position: -1 } }
        );

        return true;
    }

    // Lessons ni position reorder karo (drag-and-drop mate)
    // Reorder lesson positions (for drag-and-drop)
    static async reorder(chapterId: string, items: ReorderLessonData[]): Promise<void> {
        if (!chapterId || !items) return;

        const bulkOps = items.map(item => ({
            updateOne: {
                filter: { _id: new mongoose.Types.ObjectId(item.id), chapterId: new mongoose.Types.ObjectId(chapterId) }, // Allow Mongoose to cast
                update: { $set: { position: item.position } },
            },
        }));

        await Lesson.bulkWrite(bulkOps);
    }
}
