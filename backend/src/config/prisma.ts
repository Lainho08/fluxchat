import { PrismaClient } from '@prisma/client';
import path from 'path';

const dbPath = path.resolve(__dirname, '../../../database/prisma/dev.db');

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgresql')
        ? process.env.DATABASE_URL
        : `file:${dbPath}`,
    },
  },
});


