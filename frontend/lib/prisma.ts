// ============================================================================
// Learnix LMS - Prisma Client Singleton (Prisma ક્લાયન્ટ સિંગલટન)
// ============================================================================
// Aa file Prisma client ni alternate singleton implementation chhe.
// This file is an alternate Prisma client singleton implementation.
//
// Build-time safe: DATABASE_URL set na hoy to error throw kare chhe.
// Build-time safe: throws error if DATABASE_URL is not set.
//
// Note: db.ts pani same purpose serve kare chhe pan softer fallback sathe.
// Note: db.ts also serves the same purpose but with softer fallback.
// ============================================================================

import { PrismaClient } from './generated/prisma'

// Global scope ma Prisma instance cache karo (hot-reload safe)
// Cache Prisma instance in global scope (hot-reload safe)
const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined }

/**
 * Prisma client create karo / Create Prisma client
 *
 * DATABASE_URL na hoy to error throw kare chhe (strict mode).
 * Throws error if DATABASE_URL is not set (strict mode).
 */
function createPrismaClient() {
  if (!process.env.DATABASE_URL) {
    // Build-time proxy - DATABASE_URL vagar error throw kare chhe
    // Build-time proxy - throws error without DATABASE_URL
    return new Proxy({} as PrismaClient, {
      get() {
        throw new Error('DATABASE_URL is not set. Prisma Client cannot be used during build time.');
      }
    });
  }

  return new PrismaClient();
}

// Singleton Prisma client export karo / Export singleton Prisma client
export const prisma = globalForPrisma.prisma || createPrismaClient()

// Development ma global cache ma store karo / Store in global cache in development
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
