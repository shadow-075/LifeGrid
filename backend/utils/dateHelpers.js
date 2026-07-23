// All dates in this app are treated as plain 'YYYY-MM-DD' strings.
// That keeps timezone bugs out of streaks, heatmaps and edit-window checks.

const toDateKey = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const todayKey = () => toDateKey(new Date());

const yesterdayKey = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return toDateKey(d);
};

// Is this date key within the editable window (today or yesterday)?
const isEditableDate = (dateKey) => {
  return dateKey === todayKey() || dateKey === yesterdayKey();
};

const isFutureDate = (dateKey) => {
  return dateKey > todayKey();
};

module.exports = { toDateKey, todayKey, yesterdayKey, isEditableDate, isFutureDate };
