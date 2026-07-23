const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const DailyEntry = require('../models/DailyEntry');

// @desc    Get the logged-in user's full profile with derived stats
// @route   GET /api/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const entries = await DailyEntry.find({ user: req.user._id }).lean();

  const totalEntries = entries.length;
  const avgRating = totalEntries
    ? Math.round((entries.reduce((sum, e) => sum + e.rating, 0) / totalEntries) * 10) / 10
    : 0;
  const totalEarned = entries.reduce((sum, e) => sum + e.earned, 0);
  const totalSpent = entries.reduce((sum, e) => sum + e.spent, 0);

  const daysSinceJoined = Math.max(
    1,
    Math.ceil((Date.now() - new Date(req.user.createdAt)) / 86400000)
  );
  const completionPercentage = Math.min(100, Math.round((totalEntries / daysSinceJoined) * 100));

  res.json({
    success: true,
    profile: req.user.toPublicJSON(),
    stats: {
      totalEntries,
      avgRating,
      totalEarned,
      totalSpent,
      netMoney: totalEarned - totalSpent,
      completionPercentage,
    },
  });
});

// @desc    Update name / avatar / bio / public visibility
// @route   PUT /api/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { name, avatar, bio, isPublic } = req.body;

  const user = await User.findById(req.user._id);
  if (name !== undefined) user.name = name;
  if (avatar !== undefined) user.avatar = avatar;
  if (bio !== undefined) user.bio = bio;
  if (isPublic !== undefined) user.isPublic = isPublic;

  await user.save();

  res.json({ success: true, profile: user.toPublicJSON() });
});

module.exports = { getProfile, updateProfile };
