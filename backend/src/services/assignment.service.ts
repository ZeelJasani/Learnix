import mongoose from 'mongoose';
import { Submission, SubmissionStatus, ISubmission } from '../models/Submission';
import { PeerReview, IPeerReview } from '../models/PeerReview';
import { Lesson, ILesson } from '../models/Lesson';
import { LessonProgress } from '../models/LessonProgress';
import { ApiError } from '../utils/apiError';

export class AssignmentService {

    static async submitAssignment(userId: string, lessonId: string, content: string): Promise<ISubmission> {
        const lesson = await Lesson.findById(lessonId);
        if (!lesson) {
            throw ApiError.notFound('Lesson not found');
        }

        if (lesson.type !== 'project') {
            throw ApiError.badRequest('This lesson is not a project');
        }

        const existingSubmission = await Submission.findOne({ userId, lessonId });
        if (existingSubmission) {
            existingSubmission.content = content;
            existingSubmission.status = SubmissionStatus.SUBMITTED; // Reset status on resubmission?
            await existingSubmission.save();
            return existingSubmission;
        }

        const submission = await Submission.create({
            userId,
            lessonId,
            content,
            status: SubmissionStatus.SUBMITTED
        });

        return submission;
    }

    static async getAssignmentsToReview(userId: string, lessonId: string): Promise<ISubmission[]> {
        // Find 3 random submissions for this lesson that are NOT from this user
        // and that this user has NOT already reviewed.

        const reviewedSubmissions = await PeerReview.find({ reviewerId: userId }).select('submissionId');
        const reviewedIds = reviewedSubmissions.map(r => r.submissionId);

        const submissions = await Submission.aggregate([
            {
                $match: {
                    lessonId: new mongoose.Types.ObjectId(lessonId),
                    userId: { $ne: new mongoose.Types.ObjectId(userId) },
                    _id: { $nin: reviewedIds },
                    status: SubmissionStatus.SUBMITTED
                }
            },
            { $sample: { size: 3 } }
        ]);

        return submissions;
    }

    static async submitReview(reviewerId: string, submissionId: string, score: number, feedback: string): Promise<IPeerReview> {
        const submission = await Submission.findById(submissionId);
        if (!submission) {
            throw ApiError.notFound('Submission not found');
        }

        if (submission.userId.toString() === reviewerId) {
            throw ApiError.badRequest('Cannot review your own submission');
        }

        const existingReview = await PeerReview.findOne({ reviewerId, submissionId });
        if (existingReview) {
            throw ApiError.conflict('You have already reviewed this submission');
        }

        const review = await PeerReview.create({
            reviewerId,
            submissionId,
            score,
            feedback
        });

        // Check completion logic
        await this.checkCompletion(reviewerId, submission.lessonId.toString());

        return review;
    }

    static async checkCompletion(userId: string, lessonId: string): Promise<boolean> {
        const lesson = await Lesson.findById(lessonId);
        if (!lesson || lesson.type !== 'project') return false;

        const requiredReviews = lesson.details?.minReviewsRequired || 2; // Default to 2

        // Count reviews done by this user for submissions in this lesson
        // We need to join PeerReview -> Submission to filter by lessonId
        const reviewCount = await PeerReview.aggregate([
            { $match: { reviewerId: new mongoose.Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: 'submissions',
                    localField: 'submissionId',
                    foreignField: '_id',
                    as: 'submission'
                }
            },
            { $unwind: '$submission' },
            { $match: { 'submission.lessonId': new mongoose.Types.ObjectId(lessonId) } },
            { $count: 'count' }
        ]);

        const count = reviewCount.length > 0 ? reviewCount[0].count : 0;

        if (count >= requiredReviews) {
            // Mark lesson as completed
            await LessonProgress.findOneAndUpdate(
                { userId: new mongoose.Types.ObjectId(userId), lessonId: new mongoose.Types.ObjectId(lessonId) },
                { completed: true },
                { upsert: true, new: true }
            );
            return true;
        }

        return false;
    }

    static async getMySubmission(userId: string, lessonId: string): Promise<ISubmission | null> {
        return Submission.findOne({ userId, lessonId });
    }

    static async getReviewsReceived(userId: string, lessonId: string): Promise<IPeerReview[]> {
        const submission = await Submission.findOne({ userId, lessonId });
        if (!submission) return [];

        return PeerReview.find({ submissionId: submission._id }).populate('reviewerId', 'name image');
    }
}
