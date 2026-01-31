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
    // Get all chapters for a course
    static async getByCourseId(courseId: string): Promise<IChapter[]> {
        return Chapter.find({ courseId })
            .sort({ position: 1 })
            .lean() as unknown as IChapter[];
    }

    // Get chapter by ID
    static async getById(id: string): Promise<IChapter | null> {
        return Chapter.findById(id);
    }

    // Create a new chapter - SIMPLE VERSION
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

    // Update a chapter
    static async update(id: string, data: UpdateChapterData): Promise<IChapter | null> {
        return Chapter.findByIdAndUpdate(id, data, { new: true });
    }

    // Delete a chapter and all its lessons
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

    // Reorder chapters
    static async reorder(courseId: string, items: ReorderChapterData[]): Promise<void> {
        // Validate inputs
        if (!courseId || !items) return;

        const bulkOps = items.map(item => ({
            updateOne: {
                filter: { _id: item.id, courseId: courseId }, // Allow Mongoose to cast
                update: { $set: { position: item.position } },
            },
        }));

        await Chapter.bulkWrite(bulkOps);
    }
}
