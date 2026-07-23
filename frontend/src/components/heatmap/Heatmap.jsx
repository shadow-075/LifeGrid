import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, LayoutGrid } from 'lucide-react';
import MonthGrid from './MonthGrid';
import YearGrid from './YearGrid';
import HeatmapLegend from './HeatmapLegend';
import { MONTH_NAMES } from '../../utils/dateHelpers';

/**
 * Props:
 *  year, month           - currently displayed year / month (month is 0-indexed)
 *  entries                - array of { date, rating, ... } for `year`
 *  viewMode                - 'month' | 'year'
 *  onViewModeChange(mode)
 *  onMonthChange(newMonth) - called with the *raw* target month (may be -1 or 12)
 *  onYearChange(newYear)
 *  onDayClick(dateKey)
 */
const Heatmap = ({
  year,
  month,
  entries,
  viewMode,
  onViewModeChange,
  onMonthChange,
  onYearChange,
  onDayClick,
}) => {
  const entryMap = entries.reduce((acc, e) => {
    acc[e.date] = e.rating;
    return acc;
  }, {});

  const goPrev = () => {
    if (viewMode === 'month') {
      if (month === 0) {
        onYearChange(year - 1);
        onMonthChange(11);
      } else {
        onMonthChange(month - 1);
      }
    } else {
      onYearChange(year - 1);
    }
  };

  const goNext = () => {
    if (viewMode === 'month') {
      if (month === 11) {
        onYearChange(year + 1);
        onMonthChange(0);
      } else {
        onMonthChange(month + 1);
      }
    } else {
      onYearChange(year + 1);
    }
  };

  const nowYear = new Date().getFullYear();
  const nowMonth = new Date().getMonth();
  const disableNext = viewMode === 'month' ? year > nowYear || (year === nowYear && month >= nowMonth) : year >= nowYear;

  return (
    <div className="flex h-full flex-col">
      <div className="mb-5 flex shrink-0 flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={goPrev}
            aria-label="Previous"
            className="focus-ring rounded-lg p-1.5 hover:bg-ink/10 transition-colors"
          >
            <ChevronLeft size={18} className="text-ink/60" />
          </button>
          <h2 className="font-display text-xl font-semibold min-w-[140px] text-center">
            {viewMode === 'month' ? `${MONTH_NAMES[month]} ${year}` : year}
          </h2>
          <button
            onClick={goNext}
            aria-label="Next"
            disabled={disableNext}
            className="focus-ring rounded-lg p-1.5 hover:bg-ink/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={18} className="text-ink/60" />
          </button>
        </div>

        {/* The new Month / Year view toggle */}
        <div className="flex items-center gap-1 rounded-lg bg-ink/5 p-1">
          <button
            onClick={() => onViewModeChange('month')}
            className={`focus-ring flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              viewMode === 'month' ? 'bg-accent text-white' : 'text-ink/50 hover:text-ink/80'
            }`}
          >
            <Calendar size={14} />
            Month
          </button>
          <button
            onClick={() => onViewModeChange('year')}
            className={`focus-ring flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              viewMode === 'year' ? 'bg-accent text-white' : 'text-ink/50 hover:text-ink/80'
            }`}
          >
            <LayoutGrid size={14} />
            Year
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className={viewMode === 'month' ? 'min-h-0 flex-1' : 'mb-2'}
        >
          {viewMode === 'month' ? (
            <MonthGrid year={year} month={month} entryMap={entryMap} onDayClick={onDayClick} />
          ) : (
            <YearGrid year={year} entryMap={entryMap} onDayClick={onDayClick} />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="shrink-0">
        <HeatmapLegend />
      </div>
    </div>
  );
};

export default Heatmap;
