import { PrismaClient } from "@prisma/client";

// Extend the global type to include prisma as a global property.
declare global {
  let prisma: PrismaClient | undefined;
}

// Create or reuse the Prisma client
let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // In development mode, we use the global prisma instance to avoid creating multiple Prisma clients
  if (!globalThis.prisma) {
    globalThis.prisma = new PrismaClient();
  }
  prisma = globalThis.prisma;
}

export default prisma;
