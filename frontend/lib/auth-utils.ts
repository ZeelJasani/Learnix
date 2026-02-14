// ============================================================================
// Learnix LMS - Auth Utilities (ઓથ ઉપયોગિતા)
// ============================================================================
// Aa file legacy auth utility functions provide kare chhe.
// This file provides legacy auth utility functions.
//
// ⚠️ Deprecated: Clerk middleware use thay chhe authentication mate
// ⚠️ Deprecated: Clerk middleware is used for authentication
// ============================================================================

import { NextRequest } from 'next/server';

// Legacy session retrieval function - hamesha null return kare chhe
// Legacy session retrieval function - always returns null
// Clerk middleware automatically handle kare chhe authentication
// Clerk middleware handles authentication automatically
export function getSession(request: NextRequest) {
  void request;
  return null;
}