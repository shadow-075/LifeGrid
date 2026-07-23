const express = require('express');
const router = express.Router();
const {
  getEntriesForYear,
  getEntryByDate,
  createEntry,
  updateEntry,
  deleteEntry,
} = require('../controllers/entryController');
const { protect } = require('../middlewares/authMiddleware');
const { dateParamRule, entryBodyRules, entryUpdateRules, handleValidation } = require('../validators/entryValidator');

router.use(protect); // every entry route requires a logged-in user

router.get('/year/:year', getEntriesForYear);
router.get('/:date', dateParamRule, handleValidation, getEntryByDate);
router.post('/', entryBodyRules, createEntry);
router.put('/:date', entryUpdateRules, updateEntry);
router.delete('/:date', dateParamRule, handleValidation, deleteEntry);

module.exports = router;
