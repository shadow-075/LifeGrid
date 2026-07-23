import { useMemo } from 'react';
import HeatmapCell from './HeatmapCell';
import { todayKey, isFutureDate, MONTH_SHORT } from '../../utils/dateHelpers';

const buildMonthGrid = (year, month) => {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);

  const flat = [];

  // Pad before first day so weeks start on Sunday
  for (let i = 0; i < first.getDay(); i++) {
    flat.push(null);
  }

  for (let day = 1; day <= last.getDate(); day++) {
    flat.push({
      date: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    });
  }

  // Pad to complete final week
  while (flat.length % 7 !== 0) {
    flat.push(null);
  }

  const weeks = [];
  for (let i = 0; i < flat.length; i += 7) {
    weeks.push(flat.slice(i, i + 7));
  }

  return weeks;
};

const buildYear = (year) =>
  MONTH_SHORT.map((label, month) => ({
    label,
    weeks: buildMonthGrid(year, month),
  }));

const YearGrid = ({ year, entryMap, onDayClick }) => {
  const months = useMemo(() => buildYear(year), [year]);
  const today = todayKey();

  return (
    <div className="overflow-x-auto pb-2">
      {/* 2 columns on phones, scaling up to the full 6x2 layout on larger screens
          so month blocks wrap instead of overflowing on narrow viewports */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 min-[400px]:grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 sm:gap-x-6 sm:gap-y-8">
        {months.map((month) => (
          <div key={month.label} className="flex flex-col">
            <div className="text-[11px] text-ink/40 mb-2">
              {month.label}
            </div>

            <div className="flex gap-1">

              <div className="flex gap-1">
                {month.weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-1">
                    {week.map((cell, di) =>
                      cell ? (
                        <HeatmapCell
                          key={cell.date}
                          date={cell.date}
                          rating={entryMap[cell.date]}
                          isToday={cell.date === today}
                          isFuture={isFutureDate(cell.date)}
                          size="sm"
                          onClick={onDayClick}
                        />
                      ) : (
                        <div
                          key={di}
                          className="w-[13px] h-[13px]"
                        />
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YearGrid;