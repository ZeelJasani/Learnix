/**
 * Live Session Model / Live Session Model
 *
 * Aa model Stream.io integrated live video sessions store kare chhe.
 * This model stores Stream.io integrated live video sessions.
 *
 * Stream.io Integration / Stream.io Integration:
 * - streamCallId: Stream call nu unique identifier
 * - streamCallType: Call type (default: 'invited')
 * - Host user Clerk ID sathe link thay chhe
 *
 * Status Lifecycle / Status Lifecycle:
 * scheduled -> live -> ended
 * scheduled -> cancelled
 *
 * Mentor/Admin course mate live session schedule kari shake chhe.
 * Enrolled students session join kari shake chhe.
 * Mentors/Admins can schedule live sessions for a course.
 * Enrolled students can join the session.
 */
import mongoose, { Schema, Document } from 'mongoose';

// Live session status types / Live session status types
export type LiveSessionStatus = 'scheduled' | 'live' | 'ended' | 'cancelled';

/**
 * LiveSession document interface
 * Aa interface live session document ni structure define kare chhe
 * This interface defines the live session document structure
 */
export interface ILiveSession extends Document {
    _id: mongoose.Types.ObjectId;
    courseId: mongoose.Types.ObjectId;   // Associated course ID
    title: string;                      // Session title
    description?: string | null;        // Session description (optional)
    startsAt: Date;                     // Scheduled start time
    durationMinutes?: number | null;    // Expected duration in minutes
    status: LiveSessionStatus;          // Current session status
    streamCallId: string;               // Stream.io call ID (unique)
    streamCallType: string;             // Stream call type
    hostUserId: mongoose.Types.ObjectId; // Host (mentor) MongoDB ID
    hostClerkId: string;                // Host Clerk ID (Stream auth mate)
    endedAt?: Date | null;              // Actual end time
    createdAt: Date;
    updatedAt: Date;
}

const liveSessionSchema = new Schema<ILiveSession>(
    {
        // Associated course - student enrollment check mate vaparay chhe
        // Associated course - used for student enrollment checks
        courseId: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
            index: true,
        },
        // Session title (3-120 characters)
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 120,
        },
        // Optional session description
        description: {
            type: String,
            default: null,
        },
        // Scheduled start time
        startsAt: {
            type: Date,
            required: true,
        },
        // Expected session duration in minutes
        durationMinutes: {
            type: Number,
            default: null,
        },
        // Session lifecycle status
        status: {
            type: String,
            enum: ['scheduled', 'live', 'ended', 'cancelled'],
            default: 'scheduled',
        },
        // Stream.io call ID - unique identifier for video call
        streamCallId: {
            type: String,
            required: true,
            unique: true,
        },
        // Stream call type
        streamCallType: {
            type: String,
            default: 'invited',
        },
        // Host (mentor) nu MongoDB user ID
        // Host (mentor) MongoDB user ID
        hostUserId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        // Host nu Clerk ID - Stream.io authentication mate
        // Host's Clerk ID - for Stream.io authentication
        hostClerkId: {
            type: String,
            required: true,
        },
        // Session actually kyare end thayo (live -> ended transition par set thay chhe)
        // When session actually ended (set on live -> ended transition)
        endedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// ===== Database Indexes / Database Indexes =====
// Course sessions time sathe sort karvaa mate
// For sorting course sessions by time
liveSessionSchema.index({ courseId: 1, startsAt: 1 });

// Status thi filter karvaa mate (e.g., active sessions)
// For filtering by status (e.g., active sessions)
liveSessionSchema.index({ status: 1 });



liveSessionSchema.set('toJSON', { virtuals: true });
liveSessionSchema.set('toObject', { virtuals: true });

export const LiveSession = mongoose.model<ILiveSession>('LiveSession', liveSessionSchema);
