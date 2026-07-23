import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Flame, Trophy, Star, ChevronDown } from 'lucide-react';
import Card from '../components/ui/Card';
import PageLoader from '../components/ui/PageLoader';
import EmptyState from '../components/ui/EmptyState';
import * as exploreService from '../services/exploreService';
import { colorForRating } from '../utils/ratingColors';
import { formatLongDate } from '../utils/dateHelpers';

const PublicProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    setLoading(true);
    exploreService
      .getPublicProfileByUsername(username)
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) return <PageLoader />;

  if (error || !data) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card>
          <EmptyState title="Profile not found" description="This profile is private or no longer exists." />
        </Card>
      </div>
    );
  }

  const { profile, entries } = data;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="focus-ring flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-ink/50 hover:bg-ink/10"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <Card className="flex flex-col items-center gap-3 text-center">
        <img src={profile.avatar} alt={profile.name} className="h-20 w-20 rounded-full object-cover" />
        <h1 className="font-display text-xl font-bold">{profile.name}</h1>
        <p className="text-xs text-ink/40">@{profile.username} · Joined {formatLongDate(profile.joinedDate.slice(0, 10))}</p>
        <div className="mt-2 flex gap-6">
          <span className="flex items-center gap-1.5 text-sm text-ink/70">
            <Flame size={15} className="text-flame" /> {profile.currentStreak} streak
          </span>
          <span className="flex items-center gap-1.5 text-sm text-ink/70">
            <Trophy size={15} className="text-yellow-400" /> {profile.longestStreak} best
          </span>
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 font-display font-semibold">Public diary entries</h3>
        {entries.length === 0 ? (
          <EmptyState title="No entries yet" description="This user hasn't logged any days." />
        ) : (
          <div className="space-y-1">
            {entries.map((e) => (
              <div key={e.date} className="rounded-lg">
                <button
                  onClick={() => setExpanded(expanded === e.date ? null : e.date)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-ink/5"
                >
                  <span className="text-sm text-ink/70">{formatLongDate(e.date)}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
                      style={{ backgroundColor: colorForRating(e.rating) }}
                    >
                      {e.rating}/10
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-ink/30 transition-transform ${expanded === e.date ? 'rotate-180' : ''}`}
                    />
                  </div>
                </button>
                <AnimatePresence>
                  {expanded === e.date && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden px-3"
                    >
                      <p className="whitespace-pre-wrap pb-3 text-sm text-ink/60">
                        {e.diary || 'No diary text was written for this day.'}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default PublicProfile;
