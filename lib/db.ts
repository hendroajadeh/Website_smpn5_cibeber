import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import path from 'node:path';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDatabaseUrl() {
  const envUrl = process.env.DATABASE_URL;
  if (!envUrl) {
    return `file:${path.join(process.cwd(), 'prisma', 'dev.db')}`;
  }
  if (envUrl.startsWith('file:./')) {
    const filename = envUrl.slice('file:./'.length);
    return `file:${path.join(process.cwd(), 'prisma', filename)}`;
  }
  if (envUrl.startsWith('file:') && !path.isAbsolute(envUrl.slice(5))) {
    const filename = envUrl.slice(5);
    return `file:${path.join(process.cwd(), 'prisma', filename)}`;
  }
  return envUrl;
}

function createPrismaClient() {
  const url = getDatabaseUrl();
  const adapter = new PrismaLibSql({ url });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
