const { todayKey, yesterdayKey } = require('./dateHelpers');

// dateKeys: array of 'YYYY-MM-DD' strings, any order, no duplicates expected
// Returns { currentStreak, longestStreak }
const calculateStreaks = (dateKeys) => {
  if (!dateKeys || dateKeys.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const sorted = [...new Set(dateKeys)].sort(); // ascending, e.g. 2026-07-01, 2026-07-02...
  const asDates = sorted.map((k) => new Date(k + 'T00:00:00'));

  let longestStreak = 1;
  let running = 1;

  for (let i = 1; i < asDates.length; i++) {
    const diffDays = Math.round((asDates[i] - asDates[i - 1]) / 86400000);
    if (diffDays === 1) {
      running += 1;
    } else if (diffDays > 1) {
      running = 1;
    }
    longestStreak = Math.max(longestStreak, running);
  }

  // Current streak only counts if the chain reaches today or yesterday
  const lastLogged = sorted[sorted.length - 1];
  let currentStreak = 0;

  if (lastLogged === todayKey() || lastLogged === yesterdayKey()) {
    currentStreak = 1;
    for (let i = sorted.length - 1; i > 0; i--) {
      const diffDays = Math.round((asDates[i] - asDates[i - 1]) / 86400000);
      if (diffDays === 1) {
        currentStreak += 1;
      } else {
        break;
      }
    }
  }

  return { currentStreak, longestStreak };
};

module.exports = calculateStreaks;
