# SYSTEM INSTRUCTION: Fix Prisma v7 Initialization Error (SQLite)

## Context
We are running a Node.js backend (`jurismemo/backend`) using Prisma v7. 
Prisma v7 introduced a major breaking change: the built-in query engine has been removed in favor of Driver Adapters. Calling `new PrismaClient()` without arguments now throws a `PrismaClientInitializationError`. We are using **SQLite** for our database.

## Step 1: Update `schema.prisma`
Ensure the `datasource` block in `prisma/schema.prisma` is set to use SQLite:
\`\`\`prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
\`\`\`
*(Note: DATABASE_URL in the `.env` file should look like: `DATABASE_URL="file:./dev.db"`)*

## Step 2: Install Required Dependencies
Execute the following commands in the `jurismemo/backend` directory to install the native SQLite driver and the Prisma adapter:
\`\`\`bash
npm install better-sqlite3 @prisma/adapter-sqlite
npm install -D @types/better-sqlite3
\`\`\`

## Step 3: Rewrite `src/db.ts`
Completely replace the current contents of `src/db.ts` with the following code. 

\`\`\`typescript
import { PrismaClient } from '@prisma/client';
import Database from 'better-sqlite3';
import { PrismaSQLite } from '@prisma/adapter-sqlite';

console.log('--- BEFORE PRISMA INIT ---');

// 1. Parse the database file path from the env variable (remove 'file:' prefix for better-sqlite3)
const dbPath = process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/^file:/, '') : './prisma/dev.db';

// 2. Initialize the better-sqlite3 database connection
const sqlite = new Database(dbPath);

// 3. Initialize the Prisma SQLite adapter
const adapter = new PrismaSQLite(sqlite);

// 4. Pass the adapter directly into the PrismaClient constructor
export const prisma = new PrismaClient({ adapter });

console.log('--- AFTER PRISMA INIT ---');
// Trigger nodemon restart after PRISMA generation
\`\`\`

## Step 4: Verification
1. Run `npx prisma generate` to ensure the Prisma Client is up to date with the SQLite provider.
2. Verify that the app compiles and `nodemon` restarts successfully without throwing the `PrismaClientInitializationError`.