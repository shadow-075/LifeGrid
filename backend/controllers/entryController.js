const asyncHandler = require('express-async-handler');
const DailyEntry = require('../models/DailyEntry');
const User = require('../models/User');
const calculateStreaks = require('../utils/streak');
const { isEditableDate, isFutureDate } = require('../utils/dateHelpers');

const refreshUserStreaks = async (userId) => {
  const entries = await DailyEntry.find({ user: userId }).select('date').lean();
  const { currentStreak, longestStreak } = calculateStreaks(entries.map((e) => e.date));
  await User.findByIdAndUpdate(userId, { currentStreak, longestStreak });
  return { currentStreak, longestStreak };
};

// Sums a lean (plain-object) entry's transactions into { earned, spent } - used
// wherever we fetch with .lean() and so don't get the schema's virtuals for free
const sumTransactions = (transactions = []) => {
  let earned = 0;
  let spent = 0;
  transactions.forEach((t) => {
    if (t.type === 'earned') earned += t.amount;
    else if (t.type === 'spent') spent += t.amount;
  });
  return { earned, spent };
};

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
    .select('date rating transactions')
    .sort({ date: 1 })
    .lean();

  const mapped = entries.map((e) => {
    const { earned, spent } = sumTransactions(e.transactions);
    return { date: e.date, rating: e.rating, earned, spent };
  });

  res.json({ success: true, year, entries: mapped });
});

const getEntryByDate = asyncHandler(async (req, res) => {
  const entry = await DailyEntry.findOne({ user: req.user._id, date: req.params.date });

  if (!entry) {
    return res.json({
      success: true,
      entry: null,
      editable: isEditableDate(req.params.date),
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

const createEntry = asyncHandler(async (req, res) => {
  const { date, rating, diary, transactions } = req.body;

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
    transactions: transactions || [],
  });

  const streaks = await refreshUserStreaks(req.user._id);

  res.status(201).json({ success: true, entry, streaks });
});

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

  const { rating, diary, transactions } = req.body;
  if (rating !== undefined) entry.rating = rating;
  if (diary !== undefined) entry.diary = diary;
  if (transactions !== undefined) entry.transactions = transactions;

  await entry.save();
  const streaks = await refreshUserStreaks(req.user._id);

  res.json({ success: true, entry, streaks });
});

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