const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  port: Number(process.env.PORT) || 4000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ajaia-docs',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};

