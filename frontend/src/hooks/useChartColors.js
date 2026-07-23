import { useTheme } from '../context/ThemeContext';

// Recharts needs literal color strings for axis/grid styling, which Tailwind
// classes can't reach. This keeps those in sync with the current theme.
const useChartColors = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return {
    axis: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(20,22,28,0.5)',
    grid: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(20,22,28,0.08)',
  };
};

export default useChartColors;
