const { body, param, validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }
  next();
};

const dateParamRule = param('date')
  .matches(/^\d{4}-\d{2}-\d{2}$/)
  .withMessage('Date must be in YYYY-MM-DD format');

const entryBodyRules = [
  body('date').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Date must be in YYYY-MM-DD format'),
  body('rating').isInt({ min: 1, max: 10 }).withMessage('Rating must be an integer between 1 and 10'),
  body('diary').optional().isString().isLength({ max: 5000 }).withMessage('Diary is too long'),
  body('earned').optional().isFloat({ min: 0 }).withMessage('Earned must be a positive number'),
  body('spent').optional().isFloat({ min: 0 }).withMessage('Spent must be a positive number'),
  body('moneyNote').optional().isString().isLength({ max: 200 }).withMessage('Money note is too long'),
  handleValidation,
];

const entryUpdateRules = [
  dateParamRule,
  body('rating').optional().isInt({ min: 1, max: 10 }).withMessage('Rating must be an integer between 1 and 10'),
  body('diary').optional().isString().isLength({ max: 5000 }).withMessage('Diary is too long'),
  body('earned').optional().isFloat({ min: 0 }).withMessage('Earned must be a positive number'),
  body('spent').optional().isFloat({ min: 0 }).withMessage('Spent must be a positive number'),
  body('moneyNote').optional().isString().isLength({ max: 200 }).withMessage('Money note is too long'),
  handleValidation,
];

module.exports = { dateParamRule, entryBodyRules, entryUpdateRules, handleValidation };
