import { PrismaClient } from "./generated/prisma";

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient() {
  if (!process.env.DATABASE_URL) {
    // During build time or when not configured, return a mock client that logs warnings
    console.warn('DATABASE_URL is not set. Prisma Client is disabled. Using new backend API instead.');

    return new Proxy({} as PrismaClient, {
      get(_target, prop) {
        // Return a function that returns empty results
        return function (..._args: any[]) {
          console.warn(`Prisma method "${String(prop)}" called but DATABASE_URL is not set. This should use the new backend API.`);
          return Promise.resolve(null);
        };
      }
    });
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
