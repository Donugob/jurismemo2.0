import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

console.log('--- BEFORE PRISMA INIT ---');

const dbPath = process.env.DATABASE_URL 
  ? process.env.DATABASE_URL.replace(/^file:/, '') 
  : './dev.db';

const adapter = new PrismaBetterSqlite3({ url: dbPath });
export const prisma = new PrismaClient({ adapter });

console.log('--- AFTER PRISMA INIT ---');
// Trigger nodemon restart after PRISMA generation

