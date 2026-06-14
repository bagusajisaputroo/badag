import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

let dbUrl = process.env.DATABASE_URL || "file:./dev.db";

// Vercel Serverless Functions have a read-only filesystem except for /tmp.
// We must copy the SQLite DB to /tmp to prevent "read-only database" errors.
if (process.env.VERCEL) {
  const tmpDbPath = '/tmp/dev.db';
  if (!fs.existsSync(tmpDbPath)) {
    try {
      const originalDbPath = path.join(process.cwd(), 'prisma', 'dev.db');
      if (fs.existsSync(originalDbPath)) {
        fs.copyFileSync(originalDbPath, tmpDbPath);
      }
    } catch (e) {
      console.error("Failed to copy dev.db to /tmp:", e);
    }
  }
  dbUrl = `file:${tmpDbPath}`;
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
  })
}

const globalForPrisma = globalThis

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
