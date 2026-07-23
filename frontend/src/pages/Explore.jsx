import { useEffect, useState } from 'react';
import { Compass } from 'lucide-react';
import ExploreCard from '../components/explore/ExploreCard';
import EmptyState from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import * as exploreService from '../services/exploreService';

const Explore = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    exploreService
      .getPublicProfiles()
      .then((data) => setProfiles(data.profiles))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Explore</h1>
        <p className="mt-1 text-sm text-ink/40">Public LifeGrid profiles from the community.</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl2" />
          ))}
        </div>
      ) : profiles.length === 0 ? (
        <EmptyState icon={Compass} title="No public profiles yet" description="Be the first to make your profile public in Settings." />
      ) : (
        <div className="space-y-3">
          {profiles.map((p, i) => (
            <ExploreCard key={p.id} profile={p} delay={i * 0.03} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;
