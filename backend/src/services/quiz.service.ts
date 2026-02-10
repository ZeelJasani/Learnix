import mongoose from 'mongoose';
import { Quiz, IQuiz, IQuestion } from '../models/Quiz';
import { QuizAttempt, IQuizAttempt } from '../models/QuizAttempt';
import { Course } from '../models/Course';
import { ApiError } from '../utils/apiError';
import { CreateQuizInput, UpdateQuizInput, SubmitQuizInput } from '../validations/quiz.validation';

export class QuizService {
    /**
     * Create a new quiz
     */
    static async createQuiz(data: CreateQuizInput, userId: string): Promise<IQuiz> {
        // Verify course exists
        const course = await Course.findById(data.courseId);
        if (!course) {
            throw new ApiError(404, 'Course not found');
        }

        const quiz = new Quiz({
            ...data,
            createdBy: userId,
        });

        await quiz.save();
        return quiz;
    }

    /**
     * Update an existing quiz
     */
    static async updateQuiz(quizId: string, data: UpdateQuizInput, userId: string): Promise<IQuiz> {
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            throw new ApiError(404, 'Quiz not found');
        }

        // Check ownership (optional - can be enforced in controller)
        if (quiz.createdBy.toString() !== userId) {
            throw new ApiError(403, 'You do not have permission to update this quiz');
        }

        Object.assign(quiz, data);
        await quiz.save();
        return quiz;
    }

    /**
     * Delete a quiz
     */
    static async deleteQuiz(quizId: string, userId: string): Promise<void> {
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            throw new ApiError(404, 'Quiz not found');
        }

        // Check ownership
        if (quiz.createdBy.toString() !== userId) {
            throw new ApiError(403, 'You do not have permission to delete this quiz');
        }

        // Delete all attempts
        await QuizAttempt.deleteMany({ quizId });

        // Delete quiz
        await quiz.deleteOne();
    }

    /**
     * Get quiz by ID
     */
    static async getQuizById(quizId: string, userId?: string): Promise<IQuiz> {
        const quiz = await Quiz.findById(quizId).populate('createdBy', 'name email image');
        if (!quiz) {
            throw new ApiError(404, 'Quiz not found');
        }

        // If not published, only creator can view
        if (!quiz.isPublished && userId && quiz.createdBy._id.toString() !== userId) {
            throw new ApiError(403, 'This quiz is not published yet');
        }

        return quiz;
    }

    /**
     * Get quiz for taking (without correct answers)
     */
    static async getQuizForTaking(quizId: string, userId: string): Promise<any> {
        const quiz = await this.getQuizById(quizId, userId);

        // Check if published
        if (!quiz.isPublished) {
            throw new ApiError(403, 'This quiz is not available yet');
        }

        // Check if user can take quiz (attempt limit)
        const canTake = await this.canUserTakeQuiz(quizId, userId);
        if (!canTake.allowed) {
            throw new ApiError(403, canTake.reason || 'You cannot take this quiz');
        }

        // Return quiz without correct answers
        const quizObj = quiz.toObject();
        quizObj.questions = quizObj.questions.map((q: any) => ({
            _id: q._id,
            type: q.type,
            question: q.question,
            options: q.options,
            points: q.points,
            // Don't send correctAnswer or explanation
        }));

        return quizObj;
    }

    /**
     * Get all quizzes for a course
     */
    static async getQuizzesByCourse(courseId: string, userId?: string, includeUnpublished = false): Promise<any[]> {
        const filter: any = { courseId };
        if (!includeUnpublished) {
            filter.isPublished = true;
        }

        const quizzes = await Quiz.find(filter)
            .populate('createdBy', 'name email image')
            .sort({ createdAt: -1 });

        // If no user/public access, return as is
        if (!userId) {
            return quizzes;
        }

        // Fetch attempts for this user and these quizzes
        const quizIds = quizzes.map(q => q._id);
        const attempts = await QuizAttempt.find({
            userId,
            quizId: { $in: quizIds },
            completedAt: { $ne: null }
        }).sort({ completedAt: -1 });

        // Attach attempts to quizzes
        return quizzes.map(quiz => {
            const quizObj = quiz.toObject();
            // detailed attempts for this quiz
            const quizAttempts = attempts.filter(a => a.quizId.toString() === quiz._id.toString());
            // Sort by latest first
            quizAttempts.sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());

            return {
                ...quizObj,
                attempts: quizAttempts
            };
        });
    }

    /**
     * Start a new quiz attempt
     */
    static async startQuizAttempt(quizId: string, userId: string): Promise<IQuizAttempt> {
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            throw new ApiError(404, 'Quiz not found');
        }

        if (!quiz.isPublished) {
            throw new ApiError(403, 'This quiz is not available yet');
        }

        // Check if user can take quiz
        const canTake = await this.canUserTakeQuiz(quizId, userId);
        if (!canTake.allowed) {
            throw new ApiError(403, canTake.reason || 'You cannot take this quiz');
        }

        // Get attempt number
        const attemptNumber = canTake.attemptCount + 1;

        // Create new attempt
        const attempt = new QuizAttempt({
            userId,
            quizId,
            attemptNumber,
            totalPoints: quiz.questions.reduce((sum, q) => sum + q.points, 0),
            startedAt: new Date(),
        });

        await attempt.save();
        return attempt;
    }

    /**
     * Submit quiz attempt and grade it
     */
    static async submitQuizAttempt(
        attemptId: string,
        userId: string,
        data: SubmitQuizInput
    ): Promise<IQuizAttempt> {
        const attempt = await QuizAttempt.findById(attemptId).populate('quizId');
        if (!attempt) {
            throw new ApiError(404, 'Quiz attempt not found');
        }

        if (attempt.userId.toString() !== userId) {
            throw new ApiError(403, 'This is not your quiz attempt');
        }

        if (attempt.completedAt) {
            throw new ApiError(400, 'This quiz has already been submitted');
        }

        const quiz = attempt.quizId as any as IQuiz;

        // Check time limit
        if (quiz.timeLimit && !data.isAutoSubmitted) {
            const timeTaken = Math.floor((Date.now() - attempt.startedAt.getTime()) / 1000 / 60);
            if (timeTaken > quiz.timeLimit) {
                throw new ApiError(400, 'Time limit exceeded');
            }
        }

        // Grade the quiz
        const gradeResult = this.gradeQuiz(quiz, data.answers);

        // Update attempt
        // Explicitly set answers map
        attempt.answers = new Map(Object.entries(data.answers));

        attempt.results = gradeResult.results;
        attempt.score = gradeResult.score;
        attempt.totalPoints = gradeResult.totalPoints;
        attempt.percentage = gradeResult.percentage;
        attempt.passed = gradeResult.percentage >= quiz.passingScore;
        attempt.completedAt = new Date();
        attempt.timeTaken = Math.floor((attempt.completedAt.getTime() - attempt.startedAt.getTime()) / 1000);
        attempt.isAutoSubmitted = data.isAutoSubmitted;

        await attempt.save();

        return attempt;
    }

    /**
     * Grade a quiz
     */
    private static gradeQuiz(quiz: IQuiz, answers: Record<string, any>): {
        score: number;
        totalPoints: number;
        percentage: number;
        results: any[];
    } {
        let score = 0;
        const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
        const results = [];

        for (const question of quiz.questions) {
            const questionId = question._id.toString();
            const userAnswer = answers[questionId];
            const isCorrect = this.checkAnswer(question, userAnswer);

            const points = isCorrect ? question.points : 0;
            score += points;

            results.push({
                questionId: question._id,
                userAnswer,
                correctAnswer: question.correctAnswer,
                isCorrect,
                points,
                maxPoints: question.points,
            });
        }

        const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;

        return { score, totalPoints, percentage, results };
    }

    /**
     * Check if an answer is correct
     */
    private static checkAnswer(question: IQuestion, userAnswer: any): boolean {
        if (userAnswer === null || userAnswer === undefined) {
            return false;
        }

        switch (question.type) {
            case 'multiple_choice':
            case 'one_choice_answer':
                return userAnswer === question.correctAnswer;

            case 'true_false':
                return userAnswer === question.correctAnswer;

            case 'fill_blank':
                // Case-insensitive, trim whitespace
                const userAnswerStr = String(userAnswer).trim().toLowerCase();
                const correctAnswerStr = String(question.correctAnswer).trim().toLowerCase();
                return userAnswerStr === correctAnswerStr;

            default:
                return false;
        }
    }

    /**
     * Get user's attempt history for a quiz
     */
    static async getAttemptHistory(quizId: string, userId: string): Promise<any[]> {
        const attempts = await QuizAttempt.find({
            quizId,
            userId,
            completedAt: { $ne: null },
        })
            .sort({ attemptNumber: -1 })
            .lean();

        return attempts;
    }

    /**
     * Get a specific attempt
     */
    static async getAttemptById(attemptId: string, userId: string): Promise<IQuizAttempt> {
        const attempt = await QuizAttempt.findById(attemptId).populate('quizId');
        if (!attempt) {
            throw new ApiError(404, 'Quiz attempt not found');
        }

        if (attempt.userId.toString() !== userId) {
            throw new ApiError(403, 'This is not your quiz attempt');
        }

        return attempt;
    }

    /**
     * Check if user can take a quiz
     */
    static async canUserTakeQuiz(quizId: string, userId: string): Promise<{
        allowed: boolean;
        reason?: string;
        attemptCount: number;
    }> {
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return { allowed: false, reason: 'Quiz not found', attemptCount: 0 };
        }

        // Count completed attempts
        const attemptCount = await QuizAttempt.countDocuments({
            quizId,
            userId,
            completedAt: { $ne: null },
        });

        // Check attempt limit (0 = unlimited)
        if (quiz.allowedAttempts > 0 && attemptCount >= quiz.allowedAttempts) {
            return {
                allowed: false,
                reason: `You have used all ${quiz.allowedAttempts} allowed attempts`,
                attemptCount,
            };
        }

        return { allowed: true, attemptCount };
    }

    /**
     * Get quiz statistics (for instructors)
     */
    static async getQuizStatistics(quizId: string): Promise<any> {
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            throw new ApiError(404, 'Quiz not found');
        }

        const attempts = await QuizAttempt.find({
            quizId,
            completedAt: { $ne: null },
        }).lean();

        if (attempts.length === 0) {
            return {
                totalAttempts: 0,
                uniqueStudents: 0,
                averageScore: 0,
                averagePercentage: 0,
                passRate: 0,
                highestScore: 0,
                lowestScore: 0,
            };
        }

        const uniqueStudents = new Set(attempts.map((a) => a.userId.toString())).size;
        const totalScore = attempts.reduce((sum, a) => sum + a.score, 0);
        const totalPercentage = attempts.reduce((sum, a) => sum + a.percentage, 0);
        const passedAttempts = attempts.filter((a) => a.passed).length;

        return {
            totalAttempts: attempts.length,
            uniqueStudents,
            averageScore: Math.round(totalScore / attempts.length),
            averagePercentage: Math.round(totalPercentage / attempts.length),
            passRate: Math.round((passedAttempts / attempts.length) * 100),
            highestScore: Math.max(...attempts.map((a) => a.score)),
            lowestScore: Math.min(...attempts.map((a) => a.score)),
        };
    }
}
