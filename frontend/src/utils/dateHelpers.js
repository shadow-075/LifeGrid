// Consistent 'YYYY-MM-DD' handling across the whole app, matching the backend.

export const toDateKey = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const todayKey = () => toDateKey(new Date());

export const yesterdayKey = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return toDateKey(d);
};

export const isFutureDate = (dateKey) => dateKey > todayKey();

export const isEditableDate = (dateKey) => dateKey === todayKey() || dateKey === yesterdayKey();

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const MONTH_SHORT = MONTH_NAMES.map((m) => m.slice(0, 3));

export const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

// Returns a nicely formatted string like "22 July 2026"
export const formatLongDate = (dateKey) => {
  const [y, m, d] = dateKey.split('-').map(Number);
  return `${d} ${MONTH_NAMES[m - 1]} ${y}`;
};

// Monday-start ISO week key, e.g. "2026-W30" - used to group "this week" stats
export const isoWeekKey = (dateKey) => {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const dayNum = (date.getUTCDay() + 6) % 7; // Monday = 0
  date.setUTCDate(date.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
  const week = 1 + Math.round(((date - firstThursday) / 86400000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
  return `${date.getUTCFullYear()}-W${week}`;
};

export const startOfWeek = (date = new Date()) => {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
};
