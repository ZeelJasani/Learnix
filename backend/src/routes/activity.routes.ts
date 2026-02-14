// ============================================================================
// Learnix LMS - Activity Routes (એક્ટિવિટી રાઉટ્સ)
// ============================================================================
// Aa file student-facing activity API routes define kare chhe.
// This file defines student-facing activity API routes.
//
// Base path: /api/activities
//
// રાઉટ્સ / Routes:
// GET  /              - Enrolled courses ni activities kadho
// POST /:id/complete  - Activity complete mark karo
//
// 🔒 Badha routes authenticated chhe (verifyClerkToken + requireUser)
// 🔒 All routes are authenticated (verifyClerkToken + requireUser)
//
// Note: Activity CRUD (admin) routes admin.routes.ts ma chhe
// Note: Activity CRUD (admin) routes are in admin.routes.ts
// ============================================================================

import { Router } from 'express';
import { ActivityController } from '../controllers/activity.controller';
import { verifyClerkToken } from '../middleware/auth';
import { requireUser } from '../middleware/requireUser';

const router = Router();

// Global middleware - badha routes mate auth jaruri / Auth required for all routes
router.use(verifyClerkToken);
router.use(requireUser);

// User ni enrolled courses ni activities kadho / Get activities for user's enrolled courses
router.get('/', ActivityController.getForUser);

// Activity ne complete mark karo / Mark activity as complete
router.post('/:id/complete', ActivityController.complete);

export default router;
