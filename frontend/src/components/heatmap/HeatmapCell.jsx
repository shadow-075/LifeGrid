import { motion } from 'framer-motion';
import { colorForRating, GRAY_NOT_LOGGED, GRAY_FUTURE } from '../../utils/ratingColors';

const SIZES = {
  lg: 'h-10 w-10 sm:h-11 sm:w-11 rounded-lg',
  sm: 'h-[11px] w-[11px] sm:h-[13px] sm:w-[13px] rounded-[3px]',
};

// A single day square. Used by both the month grid and the full-year grid,
// just at different sizes.
const HeatmapCell = ({ date, rating, isToday, isFuture, size = 'lg', onClick, dayNumber }) => {
  const logged = rating !== undefined && rating !== null;
  const bg = logged ? colorForRating(rating) : isFuture ? GRAY_FUTURE : GRAY_NOT_LOGGED;
  const clickable = !isFuture;

  return (
    <motion.button
      type="button"
      whileHover={clickable ? { scale: size === 'lg' ? 1.08 : 1.35, zIndex: 10 } : {}}
      whileTap={clickable ? { scale: 0.95 } : {}}
      onClick={clickable ? () => onClick(date) : undefined}
      disabled={!clickable}
      title={logged ? `${date} - rated ${rating}/10` : isFuture ? `${date} - future` : `${date} - not logged`}
      className={`
        ${SIZES[size]}
        relative flex items-center justify-center
        transition-colors duration-200
        ${clickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}
        ${isToday ? 'ring-2 ring-offset-2 ring-offset-surface ring-accent' : ''}
      `}
      style={{ backgroundColor: bg }}
    >
      {size === 'lg' && dayNumber && (
        <span className="text-[10px] font-medium text-ink/70">{dayNumber}</span>
      )}
    </motion.button>
  );
};

export default HeatmapCell;
