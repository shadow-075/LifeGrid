const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const DailyEntry = require('../models/DailyEntry');

const getProfile = asyncHandler(async (req, res) => {
  const entries = await DailyEntry.find({ user: req.user._id }).lean();

  const totalEntries = entries.length;
  const avgRating = totalEntries
    ? Math.round((entries.reduce((sum, e) => sum + e.rating, 0) / totalEntries) * 10) / 10
    : 0;

  let totalEarned = 0;
  let totalSpent = 0;
  entries.forEach((e) => {
    (e.transactions || []).forEach((t) => {
      if (t.type === 'earned') totalEarned += t.amount;
      else if (t.type === 'spent') totalSpent += t.amount;
    });
  });

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