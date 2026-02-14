/**
 * Chapter Service / Chapter Service
 *
 * Aa service course chapters nu CRUD ane reordering handle kare chhe.
 * This service handles CRUD and reordering of course chapters.
 *
 * Features / Features:
 * - Auto-position: Navo chapter last position par create thay chhe
 * - Cascade delete: Chapter delete karta badha lessons pan delete thay chhe
 * - Bulk reorder: Drag-and-drop mate bulkWrite operation use thay chhe
 *
 * Auto-position: New chapter is created at the last position
 * Cascade delete: Deleting a chapter also deletes all its lessons
 * Bulk reorder: Uses bulkWrite for efficient drag-and-drop reordering
 */
import mongoose from 'mongoose';
import { Chapter, IChapter } from '../models/Chapter';
import { Lesson } from '../models/Lesson';

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
    // Course na badha chapters position pramane sorted return karo
    // Get all chapters for a course sorted by position
    static async getByCourseId(courseId: string): Promise<IChapter[]> {
        return Chapter.find({ courseId })
            .sort({ position: 1 })
            .lean() as unknown as IChapter[];
    }

    // ID thi chapter shodhvo / Get chapter by ID
    static async getById(id: string): Promise<IChapter | null> {
        return Chapter.findById(id);
    }

    // Navo chapter create karo - position auto-calculate thay chhe
    // Create a new chapter - position is auto-calculated
    static async create(data: CreateChapterData): Promise<IChapter> {
        // Get the next position
        const lastChapter = await Chapter.findOne({ courseId: data.courseId })
            .sort({ position: -1 })
            .select('position');

        const position = lastChapter ? lastChapter.position + 1 : 0;

        // Create and save chapter
        const chapter = new Chapter({
            title: data.title,
            courseId: new mongoose.Types.ObjectId(data.courseId),
            position,
        });

        await chapter.save();
        return chapter;
    }

    // Chapter update karo / Update a chapter
    static async update(id: string, data: UpdateChapterData): Promise<IChapter | null> {
        return Chapter.findByIdAndUpdate(id, data, { new: true });
    }

    // Chapter ane tena badha lessons delete karo (cascade delete)
    // Delete a chapter and all its lessons (cascade delete)
    static async delete(id: string): Promise<boolean> {
        const chapter = await Chapter.findById(id);
        if (!chapter) return false;

        // Delete all lessons in the chapter
        await Lesson.deleteMany({ chapterId: id });
        await Chapter.findByIdAndDelete(id);

        // Reorder remaining chapters
        await Chapter.updateMany(
            { courseId: chapter.courseId, position: { $gt: chapter.position } },
            { $inc: { position: -1 } }
        );

        return true;
    }

    // Chapters ni position reorder karo (drag-and-drop mate)
    // Reorder chapter positions (for drag-and-drop)
    static async reorder(courseId: string, items: ReorderChapterData[]): Promise<void> {
        // Validate inputs
        if (!courseId || !items) return;

        const bulkOps = items.map(item => ({
            updateOne: {
                filter: { _id: new mongoose.Types.ObjectId(item.id), courseId: new mongoose.Types.ObjectId(courseId) }, // Allow Mongoose to cast
                update: { $set: { position: item.position } },
            },
        }));

        await Chapter.bulkWrite(bulkOps);
    }
}
