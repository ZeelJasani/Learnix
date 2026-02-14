// ============================================================================
// Learnix LMS - Live Session Routes (લાઇવ સેશન રાઉટ્સ)
// ============================================================================
// Aa file live session (Stream.io) API routes define kare chhe.
// This file defines live session (Stream.io) API routes.
//
// Base path: /api/live-sessions
//
// રાઉટ્સ / Routes:
// POST /token                    - Stream.io video token generate karo
// GET  /course/:courseIdOrSlug   - Course na sessions kadho
// POST /                        - Session create karo (Mentor only)
// POST /:id/join                - Session ma join thao
// POST /:id/start               - Session start karo (Mentor only)
// POST /:id/end                 - Session end karo (Mentor only)
//
// 🔒 Badha routes authenticated chhe (verifyClerkToken + requireUser)
// 🔒 All routes are authenticated (verifyClerkToken + requireUser)
// 🔒 Create/Start/End routes requireMentor chhe
// 🔒 Create/Start/End routes require mentor role
// ============================================================================

import { Router } from 'express';
import { LiveSessionController } from '../controllers/live-session.controller';
import { verifyClerkToken } from '../middleware/auth';
import { requireUser } from '../middleware/requireUser';
import { requireMentor } from '../middleware/requireMentor';
import { validateBody } from '../middleware/validate';
import { createLiveSessionSchema } from '../validations/live-session.validation';
import { requireAdmin } from '../middleware/requireAdmin';

const router = Router();

// Global middleware - badha routes mate auth jaruri / Auth required for all routes
router.use(verifyClerkToken);
router.use(requireUser);

// Stream.io video token generate karo / Generate Stream.io video token
router.post('/token', LiveSessionController.token);

// Course na sessions kadho / List sessions by course
router.get('/course/:courseIdOrSlug', LiveSessionController.listByCourse);

// Admins mate badha sessions list karo / List all sessions for admins
router.get('/', requireAdmin, LiveSessionController.listAll);

// Session create karo - Mentor only, validation sathe / Create session - Mentor only, with validation
router.post('/', requireMentor, validateBody(createLiveSessionSchema), LiveSessionController.create);

// Session ma join thao / Join a session
router.post('/:id/join', LiveSessionController.join);

// Session start karo - Mentor only / Start session - Mentor only
router.post('/:id/start', requireMentor, LiveSessionController.start);

// Session end karo - Mentor only / End session - Mentor only
router.post('/:id/end', requireMentor, LiveSessionController.end);

export default router;
