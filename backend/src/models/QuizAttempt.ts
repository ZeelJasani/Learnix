/**
 * Quiz Attempt Model / Quiz Attempt Model
 *
 * Aa model student na quiz attempts ane tena results store kare chhe.
 * This model stores student quiz attempts and their results.
 *
 * Features / Features:
 * - Per-question result tracking (correct/incorrect, points)
 * - Score ane percentage calculation
 * - Pass/fail status
 * - Time tracking (seconds ma)
 * - Auto-submit support (time limit exceed thay to)
 * - Attempt number tracking (limited attempts mate)
 *
 * Data Flow / Data Flow:
 * Student starts quiz -> answers Map ma store thay chhe -> submit par results calculate thay chhe
 * Student starts quiz -> answers stored in Map -> results calculated on submit
 */
import mongoose, { Schema, Document } from 'mongoose';

/**
 * Individual question result nu interface
 * Interface for individual question result
 */
export interface IQuestionResult {
    questionId: mongoose.Types.ObjectId; // Question nu ID
    userAnswer: any;                     // Student nu answer
    correctAnswer: any;                  // Correct answer
    isCorrect: boolean;                  // Answer correct chhe ke nahi / Whether answer is correct
    points: number;                      // Points earned
    maxPoints: number;                   // Maximum points possible
}

/**
 * QuizAttempt document interface
 * Aa interface quiz attempt document ni structure define kare chhe
 * This interface defines the quiz attempt document structure
 */
export interface IQuizAttempt extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;     // Student nu ID
    quizId: mongoose.Types.ObjectId;     // Quiz nu ID
    answers: Map<string, any>;           // questionId -> userAnswer mapping
    results: IQuestionResult[];          // Per-question results
    score: number;                       // Total earned points
    totalPoints: number;                 // Maximum possible points
    percentage: number;                  // Score percentage
    passed: boolean;                     // Pass/fail status
    attemptNumber: number;               // Current attempt number (1-based)
    startedAt: Date;                     // Quiz start time
    completedAt: Date | null;            // Quiz completion time (null = in progress)
    timeTaken: number | null;            // Seconds ma time taken / Time taken in seconds
    isAutoSubmitted: boolean;            // True = time limit exceed thayo / True = time limit exceeded
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Question result sub-document schema
 * Aa embedded document chhe - QuizAttempt ni andar store thay chhe
 * This is an embedded document - stored inside QuizAttempt
 */
const questionResultSchema = new Schema<IQuestionResult>(
    {
        // Question nu reference ID
        questionId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        // Student nu answer (any type - question type par depend kare chhe)
        // Student's answer (any type - depends on question type)
        userAnswer: {
            type: Schema.Types.Mixed,
            default: null,
        },
        // Correct answer (comparison mate stored)
        // Correct answer (stored for comparison)
        correctAnswer: {
            type: Schema.Types.Mixed,
            required: true,
        },
        // Answer correct chhe ke nahi
        // Whether answer is correct
        isCorrect: {
            type: Boolean,
            required: true,
        },
        // Earned points
        points: {
            type: Number,
            required: true,
        },
        // Maximum possible points for this question
        maxPoints: {
            type: Number,
            required: true,
        },
    },
    { _id: false }
);

const quizAttemptSchema = new Schema<IQuizAttempt>(
    {
        // Student nu reference
        // Reference to student
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        // Quiz nu reference
        // Reference to quiz
        quizId: {
            type: Schema.Types.ObjectId,
            ref: 'Quiz',
            required: true,
            index: true,
        },
        // Student na answers - Map format ma (questionId -> answer)
        // Student's answers - in Map format (questionId -> answer)
        answers: {
            type: Map,
            of: Schema.Types.Mixed,
            default: new Map(),
        },
        // Per-question results (grading pachi populate thay chhe)
        // Per-question results (populated after grading)
        results: {
            type: [questionResultSchema],
            default: [],
        },
        // Total earned score
        score: {
            type: Number,
            required: true,
            default: 0,
        },
        // Maximum possible points
        totalPoints: {
            type: Number,
            required: true,
        },
        // Score percentage (0-100)
        percentage: {
            type: Number,
            required: true,
            default: 0,
        },
        // Pass/fail status (passingScore sathe compare thay chhe)
        // Pass/fail status (compared against passingScore)
        passed: {
            type: Boolean,
            required: true,
            default: false,
        },
        // Attempt number (1-based, limited attempts validation mate)
        // Attempt number (1-based, for limited attempts validation)
        attemptNumber: {
            type: Number,
            required: true,
            min: 1,
        },
        // Quiz kyare start thayo
        // When quiz was started
        startedAt: {
            type: Date,
            required: true,
            default: Date.now,
        },
        // Quiz kyare complete thayo (null = in progress)
        // When quiz was completed (null = in progress)
        completedAt: {
            type: Date,
            default: null,
        },
        // Time taken seconds ma
        // Time taken in seconds
        timeTaken: {
            type: Number,
            default: null,
        },
        // Auto-submit flag - time limit vhi gayo to true set thay chhe
        // Auto-submit flag - set to true if time limit expired
        isAutoSubmitted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// ===== Database Indexes / Database Indexes =====
// Unique constraint: ek student ek quiz ma ek attempt number fakat ek var hoy shake
// Unique constraint: a student can only have one attempt number per quiz
quizAttemptSchema.index({ userId: 1, quizId: 1, attemptNumber: 1 }, { unique: true });

// Leaderboard sorting mate (highest score first)
// For leaderboard sorting (highest score first)
quizAttemptSchema.index({ quizId: 1, score: -1 });

// Student ni recent attempts shodhvaa mate
// For finding student's recent attempts
quizAttemptSchema.index({ userId: 1, completedAt: -1 });

// ===== Instance Methods / Instance Methods =====

// Check karo attempt complete chhe ke nahi
// Check if attempt is completed
quizAttemptSchema.methods.isCompleted = function (): boolean {
    return this.completedAt !== null;
};

// Time taken calculate karo (seconds ma)
// Calculate time taken (in seconds)
quizAttemptSchema.methods.calculateTimeTaken = function (): number {
    if (this.completedAt) {
        return Math.floor((this.completedAt.getTime() - this.startedAt.getTime()) / 1000);
    }
    return 0;
};

export const QuizAttempt = mongoose.model<IQuizAttempt>('QuizAttempt', quizAttemptSchema);
