// ============================================================================
// Learnix LMS - Course Routes (કોર્સ રાઉટ્સ)
// ============================================================================
// Aa file public course API routes define kare chhe.
// This file defines public course API routes.
//
// Base path: /api/courses
//
// રાઉટ્સ / Routes:
// GET /          - Published courses list (public)
// GET /search    - Course search (public)
// GET /:slug     - Course by slug (optionalUser - enrollment check mate)
//
// 🔓 Badha routes public chhe - authentication jaruri nathi
// 🔓 All routes are public - no authentication required
// ============================================================================

import { Router } from 'express';
import { CourseController } from '../controllers/course.controller';
import { optionalUser } from '../middleware/optionalAuth';

const router = Router();

// Public routes - authentication jaruri nathi / No authentication required
router.get('/', CourseController.getAllPublished);
router.get('/search', CourseController.search);

// Slug route - optionalUser thi enrollment status check thay chhe
// Slug route - optionalUser enables enrollment status check
router.get('/:slug', optionalUser, CourseController.getBySlug);

export default router;
