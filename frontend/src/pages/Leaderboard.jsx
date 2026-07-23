import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import Card from '../components/ui/Card';
import Podium from '../components/leaderboard/Podium';
import LeaderboardRow from '../components/leaderboard/LeaderboardRow';
import EmptyState from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import * as leaderboardService from '../services/leaderboardService';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    leaderboardService
      .getLeaderboard()
      .then((data) => setLeaderboard(data.leaderboard))
      .finally(() => setLoading(false));
  }, []);

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Leaderboard</h1>
        <p className="mt-1 text-sm text-ink/40">Top 15 by current streak.</p>
      </div>

      {loading ? (
        <Skeleton className="h-64 w-full rounded-xl2" />
      ) : leaderboard.length === 0 ? (
        <Card>
          <EmptyState icon={Trophy} title="No streaks yet" description="Log your first day to appear here." />
        </Card>
      ) : (
        <>
          <Card>
            <Podium top3={top3} />
          </Card>
          {rest.length > 0 && (
            <Card>
              <div className="space-y-0.5">
                {rest.map((u, i) => (
                  <LeaderboardRow key={u.id} user={u} delay={i * 0.03} />
                ))}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default Leaderboard;
