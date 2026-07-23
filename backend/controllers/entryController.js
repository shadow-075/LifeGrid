const asyncHandler = require('express-async-handler');
const DailyEntry = require('../models/DailyEntry');
const User = require('../models/User');
const calculateStreaks = require('../utils/streak');
const { isEditableDate, isFutureDate } = require('../utils/dateHelpers');

// Recomputes and persists the user's streaks from their full entry history.
// Called after any create/update/delete so the numbers never drift.
const refreshUserStreaks = async (userId) => {
  const entries = await DailyEntry.find({ user: userId }).select('date').lean();
  const { currentStreak, longestStreak } = calculateStreaks(entries.map((e) => e.date));
  await User.findByIdAndUpdate(userId, { currentStreak, longestStreak });
  return { currentStreak, longestStreak };
};

// @desc    Get every entry for a given calendar year (lightweight - powers both
//          the month heatmap and the new full-year heatmap, plus client-side stats)
// @route   GET /api/entries/year/:year
// @access  Private
const getEntriesForYear = asyncHandler(async (req, res) => {
  const year = parseInt(req.params.year, 10);
  if (!year || year < 2000 || year > 2200) {
    res.status(400);
    throw new Error('Invalid year');
  }

  const start = `${year}-01-01`;
  const end = `${year}-12-31`;

  const entries = await DailyEntry.find({
    user: req.user._id,
    date: { $gte: start, $lte: end },
  })
    .select('date rating earned spent')
    .sort({ date: 1 })
    .lean();

  res.json({ success: true, year, entries });
});

// @desc    Get a single day's full entry (diary included)
// @route   GET /api/entries/:date
// @access  Private
const getEntryByDate = asyncHandler(async (req, res) => {
  const entry = await DailyEntry.findOne({ user: req.user._id, date: req.params.date });

  if (!entry) {
    return res.json({
      success: true,
      entry: null,
      editable: !isFutureDate(req.params.date) && isEditableDate(req.params.date),
      isFuture: isFutureDate(req.params.date),
    });
  }

  res.json({
    success: true,
    entry,
    editable: isEditableDate(req.params.date),
    isFuture: false,
  });
});

// @desc    Create today's (or yesterday's) entry
// @route   POST /api/entries
// @access  Private
const createEntry = asyncHandler(async (req, res) => {
  const { date, rating, diary, earned, spent, moneyNote } = req.body;

  if (isFutureDate(date)) {
    res.status(400);
    throw new Error('You cannot log an entry for a future date');
  }
  if (!isEditableDate(date)) {
    res.status(403);
    throw new Error('You can only create an entry for today or yesterday');
  }

  const alreadyExists = await DailyEntry.findOne({ user: req.user._id, date });
  if (alreadyExists) {
    res.status(409);
    throw new Error('An entry for this date already exists - edit it instead');
  }

  const entry = await DailyEntry.create({
    user: req.user._id,
    date,
    rating,
    diary,
    earned: earned || 0,
    spent: spent || 0,
    moneyNote,
  });

  const streaks = await refreshUserStreaks(req.user._id);

  res.status(201).json({ success: true, entry, streaks });
});

// @desc    Update an existing entry (only today/yesterday)
// @route   PUT /api/entries/:date
// @access  Private
const updateEntry = asyncHandler(async (req, res) => {
  const { date } = req.params;

  const entry = await DailyEntry.findOne({ user: req.user._id, date });
  if (!entry) {
    res.status(404);
    throw new Error('Entry not found');
  }

  if (!isEditableDate(date)) {
    res.status(403);
    throw new Error('Only today or yesterday can be edited');
  }

  const { rating, diary, earned, spent, moneyNote } = req.body;
  if (rating !== undefined) entry.rating = rating;
  if (diary !== undefined) entry.diary = diary;
  if (earned !== undefined) entry.earned = earned;
  if (spent !== undefined) entry.spent = spent;
  if (moneyNote !== undefined) entry.moneyNote = moneyNote;

  await entry.save();
  const streaks = await refreshUserStreaks(req.user._id);

  res.json({ success: true, entry, streaks });
});

// @desc    Delete an entry (only today/yesterday)
// @route   DELETE /api/entries/:date
// @access  Private
const deleteEntry = asyncHandler(async (req, res) => {
  const { date } = req.params;

  const entry = await DailyEntry.findOne({ user: req.user._id, date });
  if (!entry) {
    res.status(404);
    throw new Error('Entry not found');
  }

  if (!isEditableDate(date)) {
    res.status(403);
    throw new Error('Only today or yesterday can be deleted');
  }

  await entry.deleteOne();
  const streaks = await refreshUserStreaks(req.user._id);

  res.json({ success: true, message: 'Entry deleted', streaks });
});

module.exports = {
  getEntriesForYear,
  getEntryByDate,
  createEntry,
  updateEntry,
  deleteEntry,
};
