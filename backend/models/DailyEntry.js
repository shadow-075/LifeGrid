const mongoose = require('mongoose');

const dailyEntrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Stored as 'YYYY-MM-DD' (local calendar date) so lookups and sorting stay simple
    date: {
      type: String,
      required: true,
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'],
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    diary: {
      type: String,
      default: '',
      maxlength: 5000,
    },
    earned: {
      type: Number,
      default: 0,
      min: 0,
    },
    spent: {
      type: Number,
      default: 0,
      min: 0,
    },
    moneyNote: {
      type: String,
      default: '',
      maxlength: 200,
    },
  },
  { timestamps: true } // createdAt / updatedAt
);

// A user can only have one entry per calendar date
dailyEntrySchema.index({ user: 1, date: 1 }, { unique: true });

// Net is always derived, never stored, so it can't drift out of sync
dailyEntrySchema.virtual('net').get(function () {
  return this.earned - this.spent;
});

dailyEntrySchema.set('toJSON', { virtuals: true });
dailyEntrySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('DailyEntry', dailyEntrySchema);
