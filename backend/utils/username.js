const User = require('../models/User');

// Turns a display name into a URL-safe slug: "Ada Lovelace!" -> "ada-lovelace"
const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'user';

// Finds a free username by appending -2, -3, ... if the base slug is taken
const generateUniqueUsername = async (name) => {
  const base = slugify(name);
  let candidate = base;
  let suffix = 1;

  // eslint-disable-next-line no-await-in-loop
  while (await User.findOne({ username: candidate })) {
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }

  return candidate;
};

module.exports = { slugify, generateUniqueUsername };
