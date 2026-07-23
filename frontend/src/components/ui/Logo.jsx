const swatches = ['#EA580C', '#EAB308', '#4ADE80', '#10B981'];

// The brand mark is a tiny 2x2 heatmap next to the wordmark - a small nod to
// the product itself instead of a generic icon.
const Logo = ({ className = '' }) => (
  <div className={`flex items-center gap-2 select-none ${className}`}>
    <div className="grid grid-cols-2 gap-[3px]">
      {swatches.map((color, i) => (
        <span key={i} className="h-[7px] w-[7px] rounded-[2px]" style={{ backgroundColor: color }} />
      ))}
    </div>
    <span className="font-display font-semibold text-lg tracking-tight text-ink">
      Life<span className="text-accent">Grid</span>
    </span>
  </div>
);

export default Logo;
