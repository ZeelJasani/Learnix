/**
 * Live Session Service / Live Session Service
 *
 * Aa service course live sessions nu management ane Stream.io video integration handle kare chhe.
 * This service handles course live session management and Stream.io video integration.
 *
 * Stream.io Integration / Stream.io Integration:
 * - Stream.io SDK thi video call/channel create thay chhe
 * - Session create thay tyare Stream channel auto-create thay
 * - Join karta Stream token generate thay viewers/hosts mate
 *
 * Session Lifecycle / Session Lifecycle:
 * - Scheduled → Live → Ended
 * - Create: Mentor/admin session schedule kare (future date)
 * - Join: Time window check thay (15 min pahela thi 1 hr pachhi)
 * - Start: Host/admin session live kare
 * - End: Host/admin session band kare
 *
 * Permissions / Permissions:
 * - Create/Start/End: Course mentor ke admin
 * - Join: Enrolled students ane course mentor/admin
 * - List: Enrolled students ane course mentor/admin
 */
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { StreamClient } from '@stream-io/node-sdk';
import { User } from '../models/User';
import { env } from '../config/env';
import { LiveSession, ILiveSession } from '../models/LiveSession';
import { Course } from '../models/Course';
import { EnrollmentService } from './enrollment.service';
import { ApiError } from '../utils/apiError';
import { resolveCourseId, validateObjectId } from '../utils/id-resolver';

const JOIN_WINDOW_MINUTES = 10;

function getStreamClient(): StreamClient {
    return new StreamClient(env.STREAM_API_KEY, env.STREAM_API_SECRET);
}

export class LiveSessionService {
    /**
     * Nayi live session create karo ane Stream.io channel setup karo
     * Create a new live session and set up Stream.io channel
     */
    static async createSession(params: {
        courseIdOrSlug: string;
        title: string;
        description?: string;
        startsAt: string;
        durationMinutes?: number;
        hostUserId: string;
        hostClerkId: string;
        hostRole: string | null;
    }): Promise<ILiveSession> {
        const {
            courseIdOrSlug,
            title,
            description,
            startsAt,
            durationMinutes,
            hostUserId,
            hostClerkId,
            hostRole,
        } = params;

        const courseId = await resolveCourseId(courseIdOrSlug);
        const course = await Course.findById(courseId).select('userId').lean();
        if (!course) {
            throw ApiError.notFound('Course not found');
        }

        const role = (hostRole || '').toLowerCase();
        if (role === 'mentor' && course.userId.toString() !== hostUserId) {
            throw ApiError.forbidden('You can only create sessions for your own course');
        }

        const startsAtDate = new Date(startsAt);
        if (Number.isNaN(startsAtDate.getTime())) {
            throw ApiError.badRequest('Invalid start time');
        }

        const streamCallId = `live_${uuidv4()}`;
        const streamCallType = 'default';

        const streamClient = getStreamClient();
        const call = streamClient.video.call(streamCallType, streamCallId);

        await call.getOrCreate({
            data: {
                created_by_id: hostClerkId,
                starts_at: startsAtDate.toISOString(),
                members: [
                    {
                        user_id: hostClerkId,
                        role: 'host',
                    },
                ],
                custom: {
                    courseId: courseId,
                    title,
                    description,
                    hostClerkId,
                },
            },
        });

        const session = await LiveSession.create({
            courseId: new mongoose.Types.ObjectId(courseId),
            title,
            description: description || null,
            startsAt: startsAtDate,
            durationMinutes: durationMinutes ?? null,
            status: 'scheduled',
            streamCallId,
            streamCallType,
            hostUserId: new mongoose.Types.ObjectId(hostUserId),
            hostClerkId,
        });

        return session;
    }

    /**
     * User data Stream.io sathe sync karo
     * Sync user data to Stream.io
     */
    static async syncUser(user: { id: string; name: string; email: string; image?: string; role?: string }) {
        try {
            const streamClient = getStreamClient();
            await streamClient.upsertUsers({
                users: [{
                    id: user.id, // Clerk ID
                    name: user.name,
                    image: user.image,
                    role: user.role === 'admin' ? 'admin' : 'user',
                    custom: {
                        email: user.email,
                    }
                }]
            });
        } catch (error) {
            console.error('Error syncing user to Stream:', error);
            // Non-blocking error
        }
    }

    /**
     * Course ni live sessions list karo (enrollment ane permission check sathe)
     * List live sessions for a course (with enrollment and permission checks)
     */
    static async listByCourse(params: {
        courseIdOrSlug: string;
        userId: string;
        userRole: string | null;
    }): Promise<{ sessions: ILiveSession[]; canManage: boolean; isEnrolled: boolean }> {
        const { courseIdOrSlug, userId, userRole } = params;
        const courseId = await resolveCourseId(courseIdOrSlug);

        const course = await Course.findById(courseId).select('userId').lean();
        if (!course) {
            throw ApiError.notFound('Course not found');
        }

        const role = (userRole || '').toLowerCase();
        const canManage =
            role === 'admin' ||
            (role === 'mentor' && course.userId.toString() === userId);

        const enrollment = await EnrollmentService.isEnrolled(userId, courseId);

        const sessions = await LiveSession.find({ courseId: new mongoose.Types.ObjectId(courseId) })
            .sort({ startsAt: 1 })
            .lean({ virtuals: true });

        const normalizedSessions = sessions.map((session: any) => ({
            ...session,
            id: session.id || session._id?.toString(),
        }));

        return {
            sessions: normalizedSessions as unknown as ILiveSession[],
            canManage,
            isEnrolled: enrollment.enrolled || canManage,
        };
    }

    /**
     * Live session ma join karo (time window validation ane Stream token generation sathe)
     * Join a live session (with time window validation and Stream token generation)
     */
    static async joinSession(params: {
        sessionId: string;
        userId: string;
        clerkId: string;
        userRole: string | null;
    }): Promise<ILiveSession> {
        const { sessionId, userId, clerkId, userRole } = params;
        validateObjectId(sessionId, 'Live session');

        const session = await LiveSession.findById(sessionId);
        if (!session) {
            throw ApiError.notFound('Live session not found');
        }

        if (session.status === 'cancelled') {
            throw ApiError.badRequest('This session was cancelled');
        }
        if (session.status === 'ended') {
            throw ApiError.badRequest('This session has ended');
        }

        const role = (userRole || '').toLowerCase();
        const isPrivileged = role === 'admin' || role === 'mentor';
        const isHost = session.hostUserId.toString() === userId;

        if (!isPrivileged && !isHost) {
            const enrollment = await EnrollmentService.isEnrolled(userId, session.courseId.toString());
            if (!enrollment.enrolled) {
                throw ApiError.forbidden('You are not enrolled in this course');
            }

            const now = new Date();
            const joinWindowStart = new Date(session.startsAt.getTime() - JOIN_WINDOW_MINUTES * 60 * 1000);
            const withinWindow = now >= joinWindowStart || session.status === 'live';

            if (!withinWindow) {
                throw ApiError.forbidden('You can join 10 minutes before the session starts');
            }
        }

        // Ensure user exists in Stream before processing
        const user = await User.findById(userId);
        if (user) {
            await LiveSessionService.syncUser({
                id: user.clerkId || clerkId,
                name: user.name,
                email: user.email,
                image: user.image || undefined,
                role: user.role
            });
        }

        const streamClient = getStreamClient();
        const call = streamClient.video.call(session.streamCallType, session.streamCallId);
        await call.updateCallMembers({
            update_members: [
                {
                    user_id: clerkId,
                    role: isHost ? 'host' : 'user',
                },
            ],
        });

        return session;
    }

    static async startSession(params: { sessionId: string; userId: string; userRole: string | null }): Promise<ILiveSession> {
        const { sessionId, userId, userRole } = params;
        validateObjectId(sessionId, 'Live session');

        const session = await LiveSession.findById(sessionId);
        if (!session) {
            throw ApiError.notFound('Live session not found');
        }

        if (session.status === 'ended' || session.status === 'cancelled') {
            throw ApiError.badRequest('This session cannot be started');
        }

        const role = (userRole || '').toLowerCase();
        const isHost = session.hostUserId.toString() === userId;
        const isAdmin = role === 'admin';
        if (!isHost && !isAdmin) {
            throw ApiError.forbidden('Only the host or an admin can start this session');
        }

        const now = new Date();
        const streamClient = getStreamClient();
        const call = streamClient.video.call(session.streamCallType, session.streamCallId);

        await call.update({
            starts_at: now.toISOString(),
        });

        session.status = 'live';
        if (now < session.startsAt) {
            session.startsAt = now;
        }
        await session.save();

        return session;
    }

    static async endSession(params: { sessionId: string; userId: string; userRole: string | null }): Promise<ILiveSession> {
        const { sessionId, userId, userRole } = params;
        validateObjectId(sessionId, 'Live session');

        const session = await LiveSession.findById(sessionId);
        if (!session) {
            throw ApiError.notFound('Live session not found');
        }

        if (session.status === 'ended' || session.status === 'cancelled') {
            return session;
        }

        const role = (userRole || '').toLowerCase();
        const isHost = session.hostUserId.toString() === userId;
        const isAdmin = role === 'admin';
        if (!isHost && !isAdmin) {
            throw ApiError.forbidden('Only the host or an admin can end this session');
        }

        const streamClient = getStreamClient();
        const call = streamClient.video.call(session.streamCallType, session.streamCallId);
        await call.endCall();

        session.status = 'ended';
        session.endedAt = new Date();
        await session.save();

        return session;
    }
    static async getAllSessions(params: {
        page?: number;
        limit?: number;
    }): Promise<{ sessions: ILiveSession[]; total: number; pages: number }> {
        const { page = 1, limit = 20 } = params;
        const skip = (page - 1) * limit;

        const [sessions, total] = await Promise.all([
            LiveSession.find()
                .populate('courseId', 'title')
                .populate('hostUserId', 'name email image')
                .sort({ startsAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            LiveSession.countDocuments(),
        ]);

        return {
            sessions: sessions as unknown as ILiveSession[],
            total,
            pages: Math.ceil(total / limit),
        };
    }
}
