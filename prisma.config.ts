import path from 'node:path';
import { defineConfig } from 'prisma/config';
import { PrismaLibSql } from '@prisma/adapter-libsql';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL ?? `file:${path.join(process.cwd(), 'prisma', 'dev.db')}`,
  },
  // @ts-expect-error migrate is not in types but needed for prisma
  migrate: {
    async adapter(env: any) {
      const url = env.DATABASE_URL ?? `file:${path.join(process.cwd(), 'prisma', 'dev.db')}`;
      return new PrismaLibSql({ url });
    },
  },
});
