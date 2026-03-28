import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

console.log('--- BEFORE PRISMA INIT ---');

// 1. Ensure DATABASE_URL is available
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in the environment variables.");
}

// 2. Set up the standard pg connection pool
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL 
});

// 3. Initialize the Prisma Postgres adapter
const adapter = new PrismaPg(pool);

// 4. Pass the adapter directly into the PrismaClient constructor
export const prisma = new PrismaClient({ adapter });

console.log('--- AFTER PRISMA INIT ---');
