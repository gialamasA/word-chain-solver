const express = require('express');
const router = express.Router();
const wordChainsController = require('../controllers/wordChainsController');
const { validateWordChainRequest } = require('../middleware/validators');
const { handleValidationErrors } = require('../middleware/errorHandler');

// Apply validation middleware, error handler, and controller logic
router.post(
  '/',
  validateWordChainRequest, // Validation rules
  handleValidationErrors,   // Error handler
  wordChainsController.findWordChain // Controller logic
);

module.exports = router;