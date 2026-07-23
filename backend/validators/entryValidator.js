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

// Applies to any transactions array present in the body - each item, if any, must be well formed
const transactionRules = [
  body('transactions').optional().isArray().withMessage('Transactions must be an array'),
  body('transactions.*.type').isIn(['earned', 'spent']).withMessage('Transaction type must be earned or spent'),
  body('transactions.*.amount').isFloat({ min: 0 }).withMessage('Transaction amount must be a positive number'),
  body('transactions.*.note').optional().isString().isLength({ max: 200 }).withMessage('Transaction note is too long'),
];

const entryBodyRules = [
  body('date').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Date must be in YYYY-MM-DD format'),
  body('rating').isInt({ min: 1, max: 10 }).withMessage('Rating must be an integer between 1 and 10'),
  body('diary').optional().isString().isLength({ max: 5000 }).withMessage('Diary is too long'),
  ...transactionRules,
  handleValidation,
];

const entryUpdateRules = [
  dateParamRule,
  body('rating').optional().isInt({ min: 1, max: 10 }).withMessage('Rating must be an integer between 1 and 10'),
  body('diary').optional().isString().isLength({ max: 5000 }).withMessage('Diary is too long'),
  ...transactionRules,
  handleValidation,
];

module.exports = { dateParamRule, entryBodyRules, entryUpdateRules, handleValidation };