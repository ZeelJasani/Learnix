/**
 * Quiz Model / Quiz Model
 *
 * Aa model course quizzes ane tena questions store kare chhe.
 * This model stores course quizzes and their questions.
 *
 * Question Types / Question Types:
 * - multiple_choice: Multiple options, one correct answer
 * - one_choice_answer: Similar to multiple choice, select one
 * - true_false: True/False question
 * - fill_blank: Fill in the blank
 *
 * Features / Features:
 * - Configurable passing score (0-100%)
 * - Optional time limit (minutes ma)
 * - Unlimited ke limited attempts
 * - Question shuffling
 * - Answer reveal after completion
 * - Start/due date scheduling
 */
import mongoose, { Schema, Document } from 'mongoose';

// Question types / Question types
export type QuestionType = 'multiple_choice' | 'true_false' | 'fill_blank' | 'one_choice_answer';

/**
 * Individual question nu interface
 * Interface for individual question
 */
export interface IQuestion {
    _id: mongoose.Types.ObjectId;
    type: QuestionType;             // Question type
    question: string;               // Question text
    options?: string[];             // Options (multiple choice mate) / Options (for multiple choice)
    correctAnswer: string | boolean; // Correct answer
    explanation?: string;           // Answer explanation (optional)
    points: number;                 // Points awarded for correct answer
}

/**
 * Quiz document interface
 * Aa interface quiz document ni structure define kare chhe
 * This interface defines the quiz document structure
 */
export interface IQuiz extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;                      // Quiz title
    description: string | null;         // Quiz description (optional)
    courseId: mongoose.Types.ObjectId;   // Associated course
    questions: IQuestion[];             // Questions array
    passingScore: number;               // Passing percentage (0-100)
    timeLimit: number | null;           // Time limit minutes ma / Time limit in minutes
    allowedAttempts: number;            // 0 = unlimited attempts
    shuffleQuestions: boolean;          // Questions random order ma / Questions in random order
    showCorrectAnswers: boolean;        // Completion pachi answers batavo / Show answers after completion
    startDate: Date | null;             // Quiz start date (optional)
    dueDate: Date | null;               // Quiz due date (optional)
    isPublished: boolean;               // Published chhe ke nahi / Whether published
    createdBy: mongoose.Types.ObjectId; // Quiz creator (mentor/admin)
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Question sub-document schema
 * Aa embedded document chhe - Quiz document ni andar store thay chhe
 * This is an embedded document - stored inside the Quiz document
 */
const questionSchema = new Schema(
    {
        // Question type
        type: {
            type: String,
            enum: ['multiple_choice', 'true_false', 'fill_blank', 'one_choice_answer'],
            required: true,
        },
        // Question text
        question: {
            type: String,
            required: true,
            trim: true,
        },
        // Options - multiple choice ane one choice mate required chhe
        // Options - required for multiple choice and one choice questions
        options: {
            type: [String],
            default: undefined,
            validate: {
                validator: function (this: { type: string }, value: string[] | undefined) {
                    // Multiple choice ane one choice answer mate minimum 2 options jaruri chhe
                    // At least 2 options required for multiple choice and one choice answer
                    if (this.type === 'multiple_choice' || this.type === 'one_choice_answer') {
                        return value && value.length >= 2;
                    }
                    return true;
                },
                message: 'Multiple choice and one choice answer questions must have at least 2 options',
            },
        },
        // Correct answer - string ke boolean (true/false mate)
        // Correct answer - string or boolean (for true/false)
        correctAnswer: {
            type: Schema.Types.Mixed,
            required: true,
        },
        // Answer explanation (optional) - completion pachi batavay chhe
        // Answer explanation (optional) - shown after completion
        explanation: {
            type: String,
            default: null,
        },
        // Points - minimum 1 point
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
        // Quiz title
        title: {
            type: String,
            required: true,
            trim: true,
        },
        // Quiz description (optional)
        description: {
            type: String,
            default: null,
        },
        // Associated course
        courseId: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
            index: true,
        },
        // Questions array - minimum 1 question jaruri chhe
        // Questions array - at least 1 question is required
        questions: {
            type: [questionSchema],
            required: true,
            validate: {
                validator: (value: IQuestion[]) => value.length > 0,
                message: 'Quiz must have at least one question',
            },
        },
        // Passing score percentage (0-100, default: 70%)
        passingScore: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
            default: 70,
        },
        // Time limit minutes ma (null = no limit)
        // Time limit in minutes (null = no limit)
        timeLimit: {
            type: Number,
            default: null,
            min: 1,
        },
        // Allowed attempts (0 = unlimited)
        allowedAttempts: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        // Questions random order ma shuffle karo
        // Shuffle questions in random order
        shuffleQuestions: {
            type: Boolean,
            default: false,
        },
        // Completion pachi correct answers batavo
        // Show correct answers after completion
        showCorrectAnswers: {
            type: Boolean,
            default: true,
        },
        // Quiz start date (optional scheduling)
        startDate: {
            type: Date,
            default: null,
        },
        // Quiz due date (optional deadline)
        dueDate: {
            type: Date,
            default: null,
        },
        // Published status
        isPublished: {
            type: Boolean,
            default: false,
        },
        // Quiz creator (mentor/admin)
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

// ===== Database Indexes / Database Indexes =====
// Course na quizzes time sathe sort karvaa mate
// For sorting course quizzes by time
quizSchema.index({ courseId: 1, createdAt: -1 });

// Published quizzes filter karvaa mate
// For filtering published quizzes
quizSchema.index({ courseId: 1, isPublished: 1 });

// ===== Virtual Fields / Virtual Fields =====
// Total points calculate karo badha questions na points add kari ne
// Calculate total points by summing all question points
quizSchema.virtual('totalPoints').get(function () {
    return this.questions.reduce((sum, q) => sum + q.points, 0);
});

// Quiz attempts virtual population
quizSchema.virtual('attempts', {
    ref: 'QuizAttempt',
    localField: '_id',
    foreignField: 'quizId',
});

quizSchema.set('toJSON', { virtuals: true });
quizSchema.set('toObject', { virtuals: true });

export const Quiz = mongoose.model<IQuiz>('Quiz', quizSchema);
