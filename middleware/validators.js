const { body } = require('express-validator');

exports.validateWordChainRequest = [
  // Validation for "start" field
  body('start')
    .notEmpty()
    .withMessage('The "start" word is required.')
    .isString()
    .withMessage('The "start" word must be a string.')
    .trim()
    .isLength({ min: 1 })
    .withMessage('The "start" word cannot be empty.')
    .matches(/^[a-zA-Z]+$/)
    .withMessage('The "start" word must contain only letters.')
    .toLowerCase(),

  // Validation for "target" field
  body('target')
    .notEmpty()
    .withMessage('The "target" word is required.')
    .isString()
    .withMessage('The "target" word must be a string.')
    .trim()
    .isLength({ min: 1 })
    .withMessage('The "target" word cannot be empty.')
    .matches(/^[a-zA-Z]+$/)
    .withMessage('The "target" word must contain only letters.')
    .toLowerCase(),

  // Ensure "start" and "target" have the same length
  body('target').custom((value, { req }) => {
    if (value.length !== req.body.start.length) {
      throw new Error('The "start" and "target" words must have the same length.');
    }
    return true;
  }),

  // Ensure "start" and "target" are different
  body('target').custom((value, { req }) => {
    if (value === req.body.start) {
      throw new Error('The "start" and "target" words must be different.');
    }
    return true;
  }),
];