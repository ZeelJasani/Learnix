// ============================================================================
// Learnix LMS - User Routes (યુઝર રાઉટ્સ)
// ============================================================================
// Aa file user-related API routes define kare chhe.
// This file defines user-related API routes.
//
// Base path: /api/users
//
// રાઉટ્સ / Routes:
// POST /sync       - Clerk thi user data sync (verifyClerkToken only)
// GET  /me         - Authenticated user ni profile
// GET  /enrolled-courses - User na enrolled courses
//
// 🔒 /sync route faqat Clerk token verify kare chhe (user DB ma na hoy to pan)
// 🔒 /sync route only verifies Clerk token (user may not exist in DB yet)
// ============================================================================

import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { verifyClerkToken } from '../middleware/auth';
import { requireUser } from '../middleware/requireUser';

const router = Router();

// Sync route - faqat Clerk token check thay, requireUser nahi (user DB ma na hoy to pan chalse)
// Sync route - only Clerk token check, no requireUser (user may not exist in DB yet)
router.post('/sync', verifyClerkToken, UserController.syncCurrentUser);

// Aa routes mate user DB ma hovo jaruri chhe / These routes require user to exist in DB
router.get('/me', verifyClerkToken, requireUser, UserController.getProfile);
router.get('/enrolled-courses', verifyClerkToken, requireUser, UserController.getEnrolledCourses);

export default router;
