const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'dev.db');

async function test() {
  console.log('Testing PrismaBetterSqlite3 initialization...');
  try {
    const adapterFactory = new PrismaBetterSqlite3({ url: dbPath });
    const adapter = await adapterFactory.connect();
    const prisma = new PrismaClient({ adapter });
    console.log('Prisma initialized successfully.');
    // Try a simple query
    // await prisma.$connect();
    // console.log('Connected.');
  } catch (err) {
    console.error('Initialization failed:', err);
  }
}

test();
