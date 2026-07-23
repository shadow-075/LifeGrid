const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const DailyEntry = require('../models/DailyEntry');

// @desc    List all public profiles
// @route   GET /api/explore
// @access  Private
const getPublicProfiles = asyncHandler(async (req, res) => {
  const users = await User.find({ isPublic: true })
    .select('name username avatar currentStreak longestStreak createdAt')
    .sort({ currentStreak: -1 })
    .lean();

  const profiles = await Promise.all(
    users.map(async (u) => {
      const agg = await DailyEntry.aggregate([
        { $match: { user: u._id } },
        { $group: { _id: null, avgRating: { $avg: '$rating' } } },
      ]);
      return {
        id: u._id,
        name: u.name,
        username: u.username,
        avatar: u.avatar,
        currentStreak: u.currentStreak,
        longestStreak: u.longestStreak,
        joinedDate: u.createdAt,
        avgRating: agg[0] ? Math.round(agg[0].avgRating * 10) / 10 : 0,
      };
    })
  );

  res.json({ success: true, profiles });
});

// @desc    View a single public profile plus their diary entries
// @route   GET /api/explore/:username
// @access  Private
const getPublicProfileByUsername = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username });

  if (!user || !user.isPublic) {
    res.status(404);
    throw new Error('This profile is private or does not exist');
  }

  const entries = await DailyEntry.find({ user: user._id })
    .select('date rating diary earned spent moneyNote createdAt')
    .sort({ date: -1 })
    .lean();

  res.json({
    success: true,
    profile: user.toPublicJSON(),
    entries,
  });
});

module.exports = { getPublicProfiles, getPublicProfileByUsername };
