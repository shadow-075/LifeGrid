import { colorForRating, RATING_LABELS } from '../../utils/ratingColors';

const RatingSlider = ({ value, onChange, disabled = false }) => {
  const color = colorForRating(value);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-ink/60">How was the day?</span>
        <span
          className="rounded-full px-3 py-1 text-sm font-bold text-white"
          style={{ backgroundColor: color }}
        >
          {value} / 10 · {RATING_LABELS[value]}
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        step={1}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="focus-ring h-2 w-full cursor-pointer appearance-none rounded-full disabled:cursor-not-allowed"
        style={{
          background: `linear-gradient(to right, #7F1D1D, #DC2626, #EA580C, #F97316, #EAB308, #A3E635, #86EFAC, #4ADE80, #22C55E, #10B981)`,
          accentColor: color,
        }}
      />
      <div className="mt-1 flex justify-between text-[10px] text-ink/30">
        <span>1</span>
        <span>10</span>
      </div>
    </div>
  );
};

export default RatingSlider;
