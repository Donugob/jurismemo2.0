# SYSTEM INSTRUCTION: Fix Prisma v7 Initialization Error

## Context
We are upgrading/running a Node.js backend (`jurismemo/backend`) using Prisma v7. 
Prisma v7 introduced a major breaking change: the built-in Rust query engine has been removed in favor of Driver Adapters. Calling `new PrismaClient()` without arguments now throws a `PrismaClientInitializationError`.

## The Objective
Refactor the database initialization file (`src/db.ts`) to use the `@prisma/adapter-pg` driver adapter with a standard PostgreSQL connection pool.

## Step 1: Install Required Dependencies
Execute the following commands in the `jurismemo/backend` directory to install the native Postgres driver and the Prisma adapter:
\`\`\`bash
npm install pg @prisma/adapter-pg
npm install -D @types/pg
\`\`\`

## Step 2: Rewrite `src/db.ts`
Completely replace the current contents of `src/db.ts` with the following code. Do not use the old `new PrismaClient()` syntax.

\`\`\`typescript
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
// Trigger nodemon restart after PRISMA generation
\`\`\`

## Step 3: Verification
1. Ensure the `.env` file contains a valid PostgreSQL `DATABASE_URL`.
2. Verify that the app compiles and `nodemon` restarts successfully without throwing the `PrismaClientInitializationError`.