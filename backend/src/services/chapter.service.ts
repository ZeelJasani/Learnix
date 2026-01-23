import mongoose from 'mongoose';
import { Chapter, IChapter } from '../models/Chapter';
import { Lesson } from '../models/Lesson';
import { ApiError } from '../utils/apiError';

interface CreateChapterData {
    title: string;
    courseId: string;
}

interface UpdateChapterData {
    title?: string;
    position?: number;
}

interface ReorderChapterData {
    id: string;
    position: number;
}

export class ChapterService {
    /**
     * Get all chapters for a course
     */
    static async getByCourseId(courseId: string): Promise<IChapter[]> {
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            throw ApiError.badRequest('Invalid course ID');
        }

        return Chapter.find({ courseId })
            .sort({ position: 1 })
            .lean() as unknown as Promise<IChapter[]>;
    }

    /**
     * Get chapter by ID
     */
    static async getById(id: string): Promise<IChapter | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw ApiError.badRequest('Invalid chapter ID');
        }

        return Chapter.findById(id);
    }

    /**
     * Create a new chapter
     */
    static async create(data: CreateChapterData): Promise<IChapter> {
        if (!mongoose.Types.ObjectId.isValid(data.courseId)) {
            throw ApiError.badRequest('Invalid course ID');
        }

        // Get the next position
        const lastChapter = await Chapter.findOne({ courseId: data.courseId })
            .sort({ position: -1 })
            .select('position');

        const position = lastChapter ? lastChapter.position + 1 : 0;

        const chapter = new Chapter({
            title: data.title,
            courseId: new mongoose.Types.ObjectId(data.courseId),
            position,
        });

        await chapter.save();
        return chapter;
    }

    /**
     * Update a chapter
     */
    static async update(id: string, data: UpdateChapterData): Promise<IChapter | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw ApiError.badRequest('Invalid chapter ID');
        }

        return Chapter.findByIdAndUpdate(id, data, { new: true });
    }

    /**
     * Delete a chapter and all its lessons
     */
    static async delete(id: string): Promise<boolean> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw ApiError.badRequest('Invalid chapter ID');
        }

        const chapter = await Chapter.findById(id);
        if (!chapter) {
            return false;
        }

        // Delete all lessons in the chapter
        await Lesson.deleteMany({ chapterId: id });
        await Chapter.findByIdAndDelete(id);

        // Reorder remaining chapters
        await this.reorderAfterDelete(chapter.courseId.toString(), chapter.position);

        return true;
    }

    /**
     * Reorder chapters after deletion
     */
    private static async reorderAfterDelete(courseId: string, deletedPosition: number): Promise<void> {
        await Chapter.updateMany(
            { courseId, position: { $gt: deletedPosition } },
            { $inc: { position: -1 } }
        );
    }

    /**
     * Reorder chapters
     */
    static async reorder(courseId: string, items: ReorderChapterData[]): Promise<void> {
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            throw ApiError.badRequest('Invalid course ID');
        }

        const bulkOps = items.map(item => ({
            updateOne: {
                filter: { _id: new mongoose.Types.ObjectId(item.id), courseId: new mongoose.Types.ObjectId(courseId) },
                update: { $set: { position: item.position } },
            },
        }));

        await Chapter.bulkWrite(bulkOps);
    }
}
