import { todayKey, isoWeekKey, daysInMonth } from './dateHelpers';

// All functions here take `entries`: an array of { date, rating, earned, spent }
// for a single year, as returned by GET /api/entries/year/:year

export const entriesForMonth = (entries, year, month) => {
  const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  return entries.filter((e) => e.date.startsWith(prefix));
};

export const daysLoggedThisMonth = (entries, year, month) => {
  return entriesForMonth(entries, year, month).length;
};

export const avgRating = (list) => {
  if (!list.length) return 0;
  return Math.round((list.reduce((sum, e) => sum + e.rating, 0) / list.length) * 10) / 10;
};

export const avgWeeklyRating = (entries) => {
  const currentWeek = isoWeekKey(todayKey());
  const list = entries.filter((e) => isoWeekKey(e.date) === currentWeek);
  return avgRating(list);
};

export const avgMonthlyRating = (entries, year, month) => {
  return avgRating(entriesForMonth(entries, year, month));
};

const sumMoney = (list) => {
  const earned = list.reduce((sum, e) => sum + (e.earned || 0), 0);
  const spent = list.reduce((sum, e) => sum + (e.spent || 0), 0);
  return { earned, spent, net: earned - spent };
};

export const weekMoneyStats = (entries) => {
  const currentWeek = isoWeekKey(todayKey());
  return sumMoney(entries.filter((e) => isoWeekKey(e.date) === currentWeek));
};

export const monthMoneyStats = (entries, year, month) => {
  return sumMoney(entriesForMonth(entries, year, month));
};

// Last N days of ratings, sorted chronologically, for the trend line chart
export const ratingTrend = (entries, days = 30) => {
  const sorted = [...entries].sort((a, b) => (a.date > b.date ? 1 : -1));
  return sorted.slice(-days).map((e) => ({ date: e.date, rating: e.rating }));
};

// Money over time for the money chart, last N days
export const moneyTrend = (entries, days = 30) => {
  const sorted = [...entries].sort((a, b) => (a.date > b.date ? 1 : -1));
  return sorted.slice(-days).map((e) => ({
    date: e.date,
    earned: e.earned || 0,
    spent: -(e.spent || 0),
    net: (e.earned || 0) - (e.spent || 0),
  }));
};

// How many logged days fall at each rating 1-10, for the mood distribution chart
export const moodDistribution = (entries) => {
  const counts = Array.from({ length: 10 }, (_, i) => ({ rating: i + 1, count: 0 }));
  entries.forEach((e) => {
    if (e.rating >= 1 && e.rating <= 10) counts[e.rating - 1].count += 1;
  });
  return counts;
};

// % of eligible days (so far, if it's the current month) that have an entry
export const completionPercentage = (entries, year, month) => {
  const now = new Date();
  const isCurrentMonth = now.getFullYear() === year && now.getMonth() === month;
  const eligibleDays = isCurrentMonth ? now.getDate() : daysInMonth(year, month);
  const logged = daysLoggedThisMonth(entries, year, month);
  if (eligibleDays === 0) return 0;
  return Math.min(100, Math.round((logged / eligibleDays) * 100));
};

// Weekly average ratings across a whole year, for the "monthly rating graph"-style trend
export const monthlyAverages = (entries, year) => {
  return Array.from({ length: 12 }, (_, month) => {
    const list = entriesForMonth(entries, year, month);
    return {
      month: month + 1,
      avgRating: avgRating(list),
      count: list.length,
    };
  });
};

// A couple of light "productivity insight" style takeaways, generated from real data
export const buildInsights = (entries) => {
  if (!entries.length) return [];
  const insights = [];

  const dayTotals = {};
  entries.forEach((e) => {
    const dow = new Date(e.date + 'T00:00:00').getDay();
    if (!dayTotals[dow]) dayTotals[dow] = { sum: 0, count: 0 };
    dayTotals[dow].sum += e.rating;
    dayTotals[dow].count += 1;
  });
  const names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let bestDay = null;
  let bestAvg = -1;
  Object.entries(dayTotals).forEach(([dow, { sum, count }]) => {
    const avg = sum / count;
    if (avg > bestAvg) {
      bestAvg = avg;
      bestDay = names[dow];
    }
  });
  if (bestDay) insights.push(`Your best days tend to be ${bestDay}s, averaging ${bestAvg.toFixed(1)}/10.`);

  const net = entries.reduce((sum, e) => sum + ((e.earned || 0) - (e.spent || 0)), 0);
  insights.push(
    net >= 0
      ? `You're net positive this year: +${net.toLocaleString()}.`
      : `You're net negative this year: ${net.toLocaleString()}.`
  );

  const highRatingDays = entries.filter((e) => e.rating >= 8).length;
  insights.push(`${highRatingDays} of your logged days scored 8 or higher.`);

  return insights;
};
