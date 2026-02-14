// ============================================================================
// Learnix LMS - Prisma Database Client (Prisma ડેટાબેસ ક્લાયન્ટ)
// ============================================================================
// Aa file Prisma client singleton instance manage kare chhe.
// This file manages the Prisma client singleton instance.
//
// Features / વિશેષતાઓ:
// - Singleton pattern (development ma hot-reload safe)
// - Build-time mock client (DATABASE_URL vagar safe build)
// - Development ma warn+error logging, production ma faqat error
//
// Note: Aa file legacy prisma.ts thi alag chhe - banne same purpose serve
// kare chhe pan alag implementation chhe.
// Note: This file is separate from legacy prisma.ts - both serve the same
// purpose but have different implementations.
// ============================================================================

import { PrismaClient } from "./generated/prisma";

// Global scope ma Prisma instance cache karo (hot-reload safe)
// Cache Prisma instance in global scope (hot-reload safe)
const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

/**
 * Prisma client create karo / Create Prisma client
 *
 * DATABASE_URL na hoy to mock proxy client return kare chhe.
 * Returns mock proxy client if DATABASE_URL is not set.
 */
function createPrismaClient() {
  if (!process.env.DATABASE_URL) {
    // Build-time mock - DATABASE_URL vagar safely build thay
    // Build-time mock - builds safely without DATABASE_URL
    console.warn('DATABASE_URL is not set. Prisma Client is disabled. Using new backend API instead.');

    return new Proxy({} as PrismaClient, {
      get(_target, prop) {
        // Empty results return karo ane warning log karo
        // Return empty results and log warning
        return function () {
          console.warn(`Prisma method "${String(prop)}" called but DATABASE_URL is not set. This should use the new backend API.`);
          return Promise.resolve(null);
        };
      }
    });
  }

  return new PrismaClient({
    // Development ma extra logging / Extra logging in development
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
}

// Singleton Prisma client export karo / Export singleton Prisma client
export const prisma = globalForPrisma.prisma || createPrismaClient();

// Development ma global cache ma store karo (hot-reload safe)
// Store in global cache in development (hot-reload safe)
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
