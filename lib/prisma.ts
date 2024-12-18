import { PrismaClient } from "@prisma/client";

declare global {
  let prisma: PrismaClient | undefined;  // Use 'let' instead of 'var'
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (global.prisma === undefined) {
    global.prisma = new PrismaClient();
  }

  prisma = global.prisma;
}

export default prisma;
