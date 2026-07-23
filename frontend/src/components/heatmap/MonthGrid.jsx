import HeatmapCell from './HeatmapCell';
import { todayKey, isFutureDate, daysInMonth } from '../../utils/dateHelpers';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// entryMap: { 'YYYY-MM-DD': rating }
const MonthGrid = ({ year, month, entryMap, onDayClick }) => {
  const firstWeekday = new Date(year, month, 1).getDay(); // 0 = Sunday
  const totalDays = daysInMonth(year, month);
  const today = todayKey();

  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let day = 1; day <= totalDays; day++) cells.push(day);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 grid shrink-0 grid-cols-7 gap-2">
        {WEEKDAYS.map((w, i) => (
          <div key={i} className="text-center text-[11px] font-medium text-ink/40">
            {w}
          </div>
        ))}
      </div>
      <div className="grid flex-1 grid-cols-7 content-between items-center justify-items-center gap-x-2 gap-y-2">
        {cells.map((day, i) => {
          if (day === null) return <div key={`pad-${i}`} />;
          const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          return (
            <HeatmapCell
              key={dateKey}
              date={dateKey}
              dayNumber={day}
              rating={entryMap[dateKey]}
              isToday={dateKey === today}
              isFuture={isFutureDate(dateKey)}
              size="lg"
              onClick={onDayClick}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MonthGrid;
