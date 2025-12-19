import { PrismaClient } from "./generated/prisma";

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient() {
  if (!process.env.DATABASE_URL) {
    // During build time, return a mock client that won't be used
    return new Proxy({} as PrismaClient, {
      get() {
        throw new Error('DATABASE_URL is not set. Prisma Client cannot be used during build time.');
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
