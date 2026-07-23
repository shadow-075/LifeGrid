import { RATING_COLORS, GRAY_NOT_LOGGED, GRAY_FUTURE } from '../../utils/ratingColors';

const HeatmapLegend = () => (
  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink/50">
    <div className="flex items-center gap-1.5">
      <span>Low</span>
      <div className="flex gap-[2px]">
        {Object.values(RATING_COLORS).map((c, i) => (
          <span key={i} className="h-3 w-3 rounded-[3px]" style={{ backgroundColor: c }} />
        ))}
      </div>
      <span>High</span>
    </div>
    <div className="flex items-center gap-1.5">
      <span className="h-3 w-3 rounded-[3px]" style={{ backgroundColor: GRAY_NOT_LOGGED }} />
      <span>Not logged</span>
    </div>
    <div className="flex items-center gap-1.5">
      <span className="h-3 w-3 rounded-[3px]" style={{ backgroundColor: GRAY_FUTURE }} />
      <span>Future</span>
    </div>
  </div>
);

export default HeatmapLegend;
