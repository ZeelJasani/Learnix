import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestionResult {
    questionId: mongoose.Types.ObjectId;
    userAnswer: any;
    correctAnswer: any;
    isCorrect: boolean;
    points: number;
    maxPoints: number;
}

export interface IQuizAttempt extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    quizId: mongoose.Types.ObjectId;
    answers: Map<string, any>; // questionId -> userAnswer
    results: IQuestionResult[];
    score: number;
    totalPoints: number;
    percentage: number;
    passed: boolean;
    attemptNumber: number;
    startedAt: Date;
    completedAt: Date | null;
    timeTaken: number | null; // In seconds
    isAutoSubmitted: boolean; // True if submitted due to time limit
    createdAt: Date;
    updatedAt: Date;
}

const questionResultSchema = new Schema<IQuestionResult>(
    {
        questionId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        userAnswer: {
            type: Schema.Types.Mixed,
            default: null,
        },
        correctAnswer: {
            type: Schema.Types.Mixed,
            required: true,
        },
        isCorrect: {
            type: Boolean,
            required: true,
        },
        points: {
            type: Number,
            required: true,
        },
        maxPoints: {
            type: Number,
            required: true,
        },
    },
    { _id: false }
);

const quizAttemptSchema = new Schema<IQuizAttempt>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        quizId: {
            type: Schema.Types.ObjectId,
            ref: 'Quiz',
            required: true,
            index: true,
        },
        answers: {
            type: Map,
            of: Schema.Types.Mixed,
            default: new Map(),
        },
        results: {
            type: [questionResultSchema],
            default: [],
        },
        score: {
            type: Number,
            required: true,
            default: 0,
        },
        totalPoints: {
            type: Number,
            required: true,
        },
        percentage: {
            type: Number,
            required: true,
            default: 0,
        },
        passed: {
            type: Boolean,
            required: true,
            default: false,
        },
        attemptNumber: {
            type: Number,
            required: true,
            min: 1,
        },
        startedAt: {
            type: Date,
            required: true,
            default: Date.now,
        },
        completedAt: {
            type: Date,
            default: null,
        },
        timeTaken: {
            type: Number,
            default: null,
        },
        isAutoSubmitted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
quizAttemptSchema.index({ userId: 1, quizId: 1, attemptNumber: 1 }, { unique: true });
quizAttemptSchema.index({ quizId: 1, score: -1 }); // For leaderboards
quizAttemptSchema.index({ userId: 1, completedAt: -1 });

// Method to check if attempt is completed
quizAttemptSchema.methods.isCompleted = function (): boolean {
    return this.completedAt !== null;
};

// Method to calculate time taken
quizAttemptSchema.methods.calculateTimeTaken = function (): number {
    if (this.completedAt) {
        return Math.floor((this.completedAt.getTime() - this.startedAt.getTime()) / 1000);
    }
    return 0;
};

export const QuizAttempt = mongoose.model<IQuizAttempt>('QuizAttempt', quizAttemptSchema);
