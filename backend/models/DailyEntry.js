const mongoose = require('mongoose');

// A single money movement for a day - type tells us which bucket it counts toward
const transactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['earned', 'spent'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    note: {
      type: String,
      default: '',
      maxlength: 200,
    },
  },
  { _id: false }
);

const dailyEntrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
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
    // A day can have any number of earned/spent entries instead of one flat number
    transactions: {
      type: [transactionSchema],
      default: [],
    },
  },
  { timestamps: true }
);

dailyEntrySchema.index({ user: 1, date: 1 }, { unique: true });

// earned/spent/net are always derived from transactions, never stored directly,
// so they can't drift out of sync with the ledger
dailyEntrySchema.virtual('earned').get(function () {
  return this.transactions.filter((t) => t.type === 'earned').reduce((sum, t) => sum + t.amount, 0);
});

dailyEntrySchema.virtual('spent').get(function () {
  return this.transactions.filter((t) => t.type === 'spent').reduce((sum, t) => sum + t.amount, 0);
});

dailyEntrySchema.virtual('net').get(function () {
  return this.earned - this.spent;
});

dailyEntrySchema.set('toJSON', { virtuals: true });
dailyEntrySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('DailyEntry', dailyEntrySchema);