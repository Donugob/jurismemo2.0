const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'dev.db');
const adapterFactory = new PrismaBetterSqlite3({ url: dbPath });

let _prisma = null;
const initPromise = adapterFactory.connect().then(adapter => {
  console.log('Adapter connected.');
  _prisma = new PrismaClient({ adapter });
});

const prisma = new Proxy({}, {
  get(target, prop) {
    if (prop === 'then') return undefined;
    return new Proxy(() => {}, {
        get(target2, method) {
            return (...args) => initPromise.then(() => {
                if (!_prisma[prop]) throw new Error(`Property ${prop} not found on prisma`);
                if (!_prisma[prop][method]) throw new Error(`Method ${method} not found on prisma.${prop}`);
                return _prisma[prop][method](...args)
            });
        },
        apply(target2, thisArg, args) {
            return initPromise.then(() => _prisma[prop](...args));
        }
    });
  }
});

async function test() {
  console.log('Starting test...');
  try {
    // Simulate a query that comes in immediately
    console.log('Calling prisma.user.findMany()...');
    const result = await prisma.user.findMany({ where: { id: 1 } });
    console.log('Query finished (even if failed due to empty DB, initialization worked).');
  } catch (err) {
    console.log('Caught expected error (if table missing) or real error:', err.message);
  }
}

test();
