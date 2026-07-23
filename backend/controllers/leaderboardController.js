const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const DailyEntry = require('../models/DailyEntry');

// @desc    Top 15 users ranked by current streak
// @route   GET /api/leaderboard
// @access  Private
const getLeaderboard = asyncHandler(async (req, res) => {
  const users = await User.find({})
    .sort({ currentStreak: -1, longestStreak: -1 })
    .limit(15)
    .select('name avatar currentStreak longestStreak')
    .lean();

  // Average rating is computed on the fly per user - simplest correct source of truth
  const leaderboard = await Promise.all(
    users.map(async (u, index) => {
      const agg = await DailyEntry.aggregate([
        { $match: { user: u._id } },
        { $group: { _id: null, avgRating: { $avg: '$rating' } } },
      ]);
      return {
        rank: index + 1,
        id: u._id,
        name: u.name,
        avatar: u.avatar,
        currentStreak: u.currentStreak,
        longestStreak: u.longestStreak,
        avgRating: agg[0] ? Math.round(agg[0].avgRating * 10) / 10 : 0,
      };
    })
  );

  res.json({ success: true, leaderboard });
});

module.exports = { getLeaderboard };
