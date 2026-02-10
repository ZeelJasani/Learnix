import mongoose, { Schema, Document } from 'mongoose';

export type QuestionType = 'multiple_choice' | 'true_false' | 'fill_blank' | 'one_choice_answer';

export interface IQuestion {
    _id: mongoose.Types.ObjectId;
    type: QuestionType;
    question: string;
    options?: string[]; // For multiple choice
    correctAnswer: string | boolean;
    explanation?: string;
    points: number;
}

export interface IQuiz extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string | null;
    courseId: mongoose.Types.ObjectId;
    questions: IQuestion[];
    passingScore: number; // Percentage (0-100)
    timeLimit: number | null; // In minutes
    allowedAttempts: number; // 0 = unlimited
    shuffleQuestions: boolean;
    showCorrectAnswers: boolean; // Show after completion
    startDate: Date | null;
    dueDate: Date | null;
    isPublished: boolean;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const questionSchema = new Schema<IQuestion>(
    {
        type: {
            type: String,
            enum: ['multiple_choice', 'true_false', 'fill_blank', 'one_choice_answer'],
            required: true,
        },
        question: {
            type: String,
            required: true,
            trim: true,
        },
        options: {
            type: [String],
            default: undefined,
            validate: {
                validator: function (this: IQuestion, value: string[] | undefined) {
                    // Options required for multiple choice and one choice answer
                    if (this.type === 'multiple_choice' || this.type === 'one_choice_answer') {
                        return value && value.length >= 2;
                    }
                    return true;
                },
                message: 'Multiple choice and one choice answer questions must have at least 2 options',
            },
        },
        correctAnswer: {
            type: Schema.Types.Mixed,
            required: true,
        },
        explanation: {
            type: String,
            default: null,
        },
        points: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
        },
    },
    { _id: true }
);

const quizSchema = new Schema<IQuiz>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: null,
        },
        courseId: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
            index: true,
        },
        questions: {
            type: [questionSchema],
            required: true,
            validate: {
                validator: (value: IQuestion[]) => value.length > 0,
                message: 'Quiz must have at least one question',
            },
        },
        passingScore: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
            default: 70,
        },
        timeLimit: {
            type: Number,
            default: null,
            min: 1,
        },
        allowedAttempts: {
            type: Number,
            required: true,
            min: 0,
            default: 0, // 0 = unlimited
        },
        shuffleQuestions: {
            type: Boolean,
            default: false,
        },
        showCorrectAnswers: {
            type: Boolean,
            default: true,
        },
        startDate: {
            type: Date,
            default: null,
        },
        dueDate: {
            type: Date,
            default: null,
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
quizSchema.index({ courseId: 1, createdAt: -1 });
quizSchema.index({ courseId: 1, isPublished: 1 });

// Virtual for total points
quizSchema.virtual('totalPoints').get(function () {
    return this.questions.reduce((sum, q) => sum + q.points, 0);
});

// Virtual for attempts
quizSchema.virtual('attempts', {
    ref: 'QuizAttempt',
    localField: '_id',
    foreignField: 'quizId',
});

quizSchema.set('toJSON', { virtuals: true });
quizSchema.set('toObject', { virtuals: true });

export const Quiz = mongoose.model<IQuiz>('Quiz', quizSchema);
