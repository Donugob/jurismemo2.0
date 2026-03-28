const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'dev.db');
let _prisma = null;

const getPrisma = async () => {
    if (!_prisma) {
        console.log('Connecting to adapter...');
        const adapter = await new PrismaBetterSqlite3({ url: dbPath }).connect();
        _prisma = new PrismaClient({ adapter });
    }
    return _prisma;
};

const prisma = new Proxy({}, {
  get(target, prop) {
    if (prop === 'then') return undefined;
    return new Proxy({}, {
        get(target2, method) {
            return async (...args) => {
                const client = await getPrisma();
                return client[prop][method](...args);
            };
        }
    });
  }
});

async function test() {
  console.log('Starting test...');
  try {
    console.log('Calling prisma.user.findMany()...');
    const result = await prisma.user.findMany({ where: { id: 1 } });
    console.log('Query finished.');
  } catch (err) {
    console.log('Caught error (likely TableDoesNotExist):', err.message);
  }
}

test();
