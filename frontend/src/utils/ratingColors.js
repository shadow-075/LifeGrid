// Single source of truth for the 1-10 rating color scale used across
// the heatmap, slider, charts and mood distribution.
export const RATING_COLORS = {
  1: '#7F1D1D', // Dark Red
  2: '#DC2626', // Red
  3: '#EA580C', // Orange Red
  4: '#F97316', // Orange
  5: '#EAB308', // Yellow
  6: '#A3E635', // Yellow Green
  7: '#86EFAC', // Light Green
  8: '#4ADE80', // Green
  9: '#22C55E', // Bright Green
  10: '#10B981', // Emerald Green
};

export const GRAY_NOT_LOGGED = '#3F4250';
export const GRAY_FUTURE = '#1C1E26';

export const RATING_LABELS = {
  1: 'Awful',
  2: 'Bad',
  3: 'Rough',
  4: 'Meh',
  5: 'Okay',
  6: 'Fine',
  7: 'Good',
  8: 'Great',
  9: 'Amazing',
  10: 'Perfect',
};

export const colorForRating = (rating) => RATING_COLORS[rating] || GRAY_NOT_LOGGED;
