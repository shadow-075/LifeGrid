const ChartTooltip = ({ active, payload, label, formatter }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="glass rounded-lg px-3 py-2 text-xs shadow-glow">
      <p className="mb-1 font-medium text-ink/70">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.fill }}>
          {formatter ? formatter(p) : `${p.name}: ${p.value}`}
        </p>
      ))}
    </div>
  );
};

export default ChartTooltip;
