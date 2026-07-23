import Card from '../ui/Card';
import { colorForRating } from '../../utils/ratingColors';
import { startOfWeek, toDateKey, todayKey, isFutureDate } from '../../utils/dateHelpers';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const WeeklyMoodChart = ({ entryMap }) => {
  const start = startOfWeek();
  const today = todayKey();

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const key = toDateKey(d);
    return { key, label: DAY_LABELS[i], rating: entryMap[key] };
  });

  return (
    <Card>
      <h3 className="mb-4 font-display font-semibold">This week's mood</h3>
      <div className="flex items-end justify-between gap-2">
        {days.map((d) => {
          const logged = d.rating !== undefined;
          const height = logged ? 20 + d.rating * 8 : 20;
          return (
            <div key={d.key} className="flex flex-1 flex-col items-center gap-2">
              <div
                className={`w-full rounded-lg transition-all ${d.key === today ? 'ring-2 ring-accent' : ''}`}
                style={{
                  height,
                  backgroundColor: logged
                    ? colorForRating(d.rating)
                    : isFutureDate(d.key)
                    ? '#1C1E26'
                    : '#3F4250',
                }}
              />
              <span className="text-[10px] text-ink/40">{d.label}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default WeeklyMoodChart;
