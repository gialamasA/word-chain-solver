const express = require('express');
const redisClient = require('./utils/redisClient');
const wordChainsRoutes = require('./routes/wordChainsRoutes');
const logger = require('./utils/logger');

const app = express();
app.use(express.json());

// Use the logging middleware
app.use(logger);

// Ensure Redis is connected
redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

// Error handler for malformed JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON format.',
    });
  }
  next();
});

// API route
app.use('/word-chains', wordChainsRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});