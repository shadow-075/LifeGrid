const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 40,
    },
    // URL-safe handle used in public profile links, e.g. /explore/ada-lovelace,
    // instead of exposing raw database IDs in the URL
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, 'Username can only contain lowercase letters, numbers and hyphens'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // never return password by default
    },
    avatar: {
      type: String,
      // DiceBear avatar, seeded with a random string so every user gets a unique default
      default: function () {
        return `https://api.dicebear.com/10.x/thumbs/svg?seed=${Math.random().toString(36).slice(2, 10)}`;
      },
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    bio: {
      type: String,
      maxlength: 160,
      default: '',
    },
  },
  { timestamps: true } // gives us createdAt (joined date) and updatedAt for free
);

// Hash password before saving, but only if it changed
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Strip sensitive/internal fields whenever a user doc is sent as JSON
userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    name: this.name,
    username: this.username,
    email: this.email,
    avatar: this.avatar,
    isPublic: this.isPublic,
    currentStreak: this.currentStreak,
    longestStreak: this.longestStreak,
    bio: this.bio,
    joinedDate: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
