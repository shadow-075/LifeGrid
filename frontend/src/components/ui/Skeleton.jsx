export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse rounded-lg bg-ink/5 ${className}`} />
);

export const StatCardSkeleton = () => (
  <div className="glass rounded-xl2 p-5">
    <Skeleton className="mb-3 h-3 w-20" />
    <Skeleton className="h-7 w-16" />
  </div>
);

export const HeatmapSkeleton = () => (
  <div>
    <Skeleton className="mb-5 h-8 w-40" />
    <div className="grid grid-cols-7 gap-2">
      {Array.from({ length: 35 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-10" />
      ))}
    </div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="glass rounded-xl2 p-5">
    <Skeleton className="mb-4 h-4 w-32" />
    <Skeleton className="h-[220px] w-full" />
  </div>
);
