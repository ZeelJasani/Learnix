/**
 * Enrollment Model / Enrollment Model
 *
 * Aa model student-course enrollment track kare chhe.
 * This model tracks student-course enrollments.
 *
 * Enrollment Flow / Enrollment Flow:
 * 1. Student course purchase kare chhe (Stripe Checkout)
 * 2. Pending status sathe enrollment create thay chhe
 * 3. Payment success par Active status set thay chhe
 * 4. Cancellation par Cancelled status set thay chhe
 *
 * Duplicate Prevention / Duplicate Prevention:
 * - Compound unique index (userId + courseId) duplicate enrollment aatke chhe
 * - One student can only enroll once per course
 */
import mongoose, { Schema, Document } from 'mongoose';

// Enrollment status types / Enrollment status types
export type EnrollmentStatus = 'Pending' | 'Active' | 'Cancelled';

/**
 * Enrollment document interface
 * Aa interface enrollment document ni structure define kare chhe
 * This interface defines the enrollment document structure
 */
export interface IEnrollment extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;    // Student nu ID / Student's ID
    courseId: mongoose.Types.ObjectId;   // Course nu ID / Course ID
    amount: number;                     // Payment amount / Payment amount
    status: EnrollmentStatus;           // Enrollment status
    paymentId?: string;                 // Stripe payment intent ID (optional)
    createdAt: Date;
    updatedAt: Date;
}

const enrollmentSchema = new Schema<IEnrollment>(
    {
        // Student nu reference - User model sathe link
        // Student reference - linked to User model
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        // Course nu reference - Course model sathe link
        // Course reference - linked to Course model
        courseId: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
        // Payment amount (free courses mate 0)
        // Payment amount (0 for free courses)
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        // Enrollment status
        status: {
            type: String,
            enum: ['Pending', 'Active', 'Cancelled'],
            default: 'Pending',
        },
        // Stripe payment intent ID - payment tracking mate
        // Stripe payment intent ID - for payment tracking
        paymentId: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// ===== Database Indexes / Database Indexes =====
// Duplicate enrollment prevent karvaa mate compound unique index
// Compound unique index to prevent duplicate enrollments
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

// User na enrollments filter karvaa mate
// For filtering user's enrollments
enrollmentSchema.index({ userId: 1, status: 1 });

// Course na enrollments shodhvaa mate
// For finding course enrollments
enrollmentSchema.index({ courseId: 1 });

export const Enrollment = mongoose.model<IEnrollment>('Enrollment', enrollmentSchema);
