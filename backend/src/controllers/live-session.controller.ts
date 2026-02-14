// ============================================================================
// Learnix LMS - Live Session Controller (લાઇવ સેશન કંટ્રોલર)
// ============================================================================
// Aa controller live session-related HTTP requests handle kare chhe.
// This controller handles live session-related HTTP requests.
//
// જવાબદારીઓ / Responsibilities:
// - Live session creation (લાઇવ સેશન creation)
// - Course wise session listing (કોર્સ wise session list)
// - Session join with time-window validation (સેશન join)
// - Session start/end lifecycle (સેશન start/end lifecycle)
// - Stream.io token generation (Stream.io ટોકન generation)
// ============================================================================

import { Response, NextFunction } from 'express';
import { StreamClient } from '@stream-io/node-sdk';
import { env } from '../config/env';
import { UserRequest } from '../middleware/requireUser';
import { LiveSessionService } from '../services/live-session.service';
import { ApiResponse } from '../utils/apiResponse';

/**
 * LiveSessionController - લાઇવ સેશન સંબંધિત API endpoints
 * LiveSessionController - Live session-related API endpoints
 *
 * Stream.io Video SDK sathe integrate thay chhe live video sessions mate.
 * Integrates with Stream.io Video SDK for live video sessions.
 */
export class LiveSessionController {
    /**
     * Navo live session create karo / Create a new live session
     *
     * Host user ni details ane session parameters accept kare chhe.
     * Accepts host user details and session parameters.
     *
     * @route POST /api/live-sessions
     */
    static async create(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = req.user!;
            const { courseIdOrSlug, title, description, startsAt, durationMinutes } = req.body;

            // Session create karo host details sathe / Create session with host details
            const session = await LiveSessionService.createSession({
                courseIdOrSlug,
                title,
                description,
                startsAt,
                durationMinutes,
                hostUserId: user.id,
                hostClerkId: user.clerkId,
                hostRole: user.role,
            });

            ApiResponse.created(res, session);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Course na sessions kadho / List sessions by course
     *
     * User ni enrollment/role verify karine sessions return kare chhe.
     * Verifies user enrollment/role and returns sessions.
     *
     * @route GET /api/live-sessions/course/:courseIdOrSlug
     */
    static async listByCourse(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = req.user!;
            const { courseIdOrSlug } = req.params;

            // Sessions kadho user context sathe / List sessions with user context
            const result = await LiveSessionService.listByCourse({
                courseIdOrSlug,
                userId: user.id,
                userRole: user.role,
            });

            ApiResponse.success(res, result);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Live session ma join thao / Join a live session
     *
     * Time-window validation thay chhe - session scheduled time ni aaspaas j join thai shakay.
     * Time-window validation occurs - can only join around session's scheduled time.
     *
     * @route POST /api/live-sessions/:id/join
     */
    static async join(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = req.user!;
            const { id } = req.params;

            // Session join karo user details sathe / Join session with user details
            const session = await LiveSessionService.joinSession({
                sessionId: id,
                userId: user.id,
                clerkId: user.clerkId,
                userRole: user.role,
            });

            ApiResponse.success(res, session);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Live session start karo (Host/Admin) / Start a live session (Host/Admin)
     *
     * Faqat host ke admin j session start kari shake chhe.
     * Only host or admin can start a session.
     *
     * @route POST /api/live-sessions/:id/start
     */
    static async start(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = req.user!;
            const { id } = req.params;

            // Session start karo / Start the session
            const session = await LiveSessionService.startSession({
                sessionId: id,
                userId: user.id,
                userRole: user.role,
            });

            ApiResponse.success(res, session);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Live session end karo (Host/Admin) / End a live session (Host/Admin)
     *
     * Session status 'ended' ma change thay chhe.
     * Session status changes to 'ended'.
     *
     * @route POST /api/live-sessions/:id/end
     */
    static async end(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = req.user!;
            const { id } = req.params;

            // Session end karo / End the session
            const session = await LiveSessionService.endSession({
                sessionId: id,
                userId: user.id,
                userRole: user.role,
            });

            ApiResponse.success(res, session);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Stream.io video token generate karo / Generate Stream.io video token
     *
     * User na Clerk ID mate token generate kare chhe - 1 hour expiry.
     * Generates token for user's Clerk ID - 1 hour expiry.
     *
     * @route GET /api/live-sessions/token
     */
    static async token(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = req.user!;

            // Stream client initialize karo / Initialize Stream client
            const streamClient = new StreamClient(env.STREAM_API_KEY, env.STREAM_API_SECRET);

            // Token expiry ane issued-at set karo / Set token expiry and issued-at
            const expirationTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour expiry
            const issuedAt = Math.floor(Date.now() / 1000) - 60; // 60 seconds grace period
            const token = streamClient.createToken(user.clerkId, expirationTime, issuedAt);

            ApiResponse.success(res, { token });
        } catch (error) {
            next(error);
        }
    }
    /**
     * Badha live sessions list karo (Admin only) / List all live sessions (Admin only)
     *
     * @route GET /api/live-sessions
     */
    static async listAll(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;

            const result = await LiveSessionService.getAllSessions({ page, limit });
            ApiResponse.success(res, result);
        } catch (error) {
            next(error);
        }
    }
}
