const express = require('express');
const cors = require('cors');
const { clientUrl } = require('./config/env');
const routes = require('./routes');

const app = express();

app.use(
  cors({
    origin: clientUrl,
    credentials: false,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api', routes);

app.use((error, _req, res, _next) => {
  console.error(error);
  const status = error.status || 500;
  res.status(status).json({ message: error.message || 'Internal server error' });
});

module.exports = app;

