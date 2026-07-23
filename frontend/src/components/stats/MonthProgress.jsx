import Card from '../ui/Card';

const MonthProgress = ({ percentage, daysLogged, totalDays }) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <Card className="flex items-center gap-5">
      <div className="relative h-24 w-24 shrink-0">
        <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#6C5CE7"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-display text-xl font-bold">
          {percentage}%
        </div>
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-ink/40">Month progress</p>
        <p className="mt-1 text-sm text-ink/60">
          {daysLogged} of {totalDays} eligible days logged
        </p>
      </div>
    </Card>
  );
};

export default MonthProgress;
