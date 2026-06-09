const User = require('../models/User');

const seedUsers = [
  { name: 'Ava Owner', email: 'ava@ajaia.test' },
  { name: 'Ben Collaborator', email: 'ben@ajaia.test' },
  { name: 'Cara Reviewer', email: 'cara@ajaia.test' },
];

async function seedInitialUsers() {
  await Promise.all(
    seedUsers.map((user) => User.updateOne({ email: user.email }, user, { upsert: true }))
  );
}

module.exports = { seedInitialUsers, seedUsers };

