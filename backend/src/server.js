const app = require('./app');
const { connectDatabase } = require('./config/database');
const { port } = require('./config/env');
const { seedInitialUsers } = require('./services/seed');

async function start() {
  await connectDatabase();
  await seedInitialUsers();
  app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start backend', error);
  process.exit(1);
});

