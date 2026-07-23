import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Flame, Trophy, Star, Wallet, CalendarDays, PieChart } from 'lucide-react';
import Card from '../components/ui/Card';
import StatCard from '../components/stats/StatCard';
import AchievementBadges from '../components/profile/AchievementBadges';
import PageLoader from '../components/ui/PageLoader';
import EmptyState from '../components/ui/EmptyState';
import * as profileService from '../services/profileService';
import useYearEntries from '../hooks/useYearEntries';
import { useAuth } from '../context/AuthContext';
import { colorForRating } from '../utils/ratingColors';
import { formatLongDate } from '../utils/dateHelpers';
import { avgWeeklyRating as weeklyAvg, avgMonthlyRating as monthlyAvg } from '../utils/stats';

const now = new Date();

const Profile = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { entries } = useYearEntries(now.getFullYear());

  useEffect(() => {
    profileService
      .getProfile()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;
  if (!data) return null;

  const { profile, stats } = data;
  const recent = [...entries].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 8);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Card className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <img src={profile.avatar} alt={profile.name} className="h-20 w-20 rounded-full object-cover" />
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold">{profile.name}</h1>
          <p className="text-sm text-ink/40">@{profile.username} · Joined {formatLongDate(profile.joinedDate.slice(0, 10))}</p>
          {profile.bio && <p className="mt-2 text-sm text-ink/60">{profile.bio}</p>}
          <span
            className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
              profile.isPublic ? 'bg-green-500/15 text-green-400' : 'bg-ink/10 text-ink/50'
            }`}
          >
            {profile.isPublic ? 'Public profile' : 'Private profile'}
          </span>
        </div>
        <Link
          to="/settings"
          className="focus-ring flex items-center gap-2 rounded-lg border border-ink/10 px-4 py-2 text-sm font-medium text-ink/70 hover:bg-ink/10"
        >
          <SettingsIcon size={15} /> Edit profile
        </Link>
      </Card>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={Flame} label="Current streak" value={user?.currentStreak ?? 0} accentColor="#FF9F43" />
        <StatCard icon={Trophy} label="Longest streak" value={user?.longestStreak ?? 0} accentColor="#EAB308" delay={0.05} />
        <StatCard icon={Star} label="Avg rating" value={`${stats.avgRating}/10`} accentColor="#10B981" delay={0.1} />
        <StatCard icon={CalendarDays} label="Total entries" value={stats.totalEntries} accentColor="#6C5CE7" delay={0.15} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={PieChart} label="Completion" value={`${stats.completionPercentage}%`} subvalue="Since joining" />
        <StatCard icon={Star} label="Weekly average" value={`${weeklyAvg(entries)}/10`} delay={0.05} />
        <StatCard icon={Star} label="Monthly average" value={`${monthlyAvg(entries, now.getFullYear(), now.getMonth())}/10`} delay={0.1} />
      </div>

      <Card>
        <h3 className="mb-3 flex items-center gap-2 font-display font-semibold">
          <Wallet size={16} className="text-ink/40" /> Money overview
        </h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xs text-ink/40">Total earned</p>
            <p className="font-bold text-green-400">+{stats.totalEarned.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-ink/40">Total spent</p>
            <p className="font-bold text-red-400">-{stats.totalSpent.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-ink/40">Net</p>
            <p className={`font-bold ${stats.netMoney >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.netMoney >= 0 ? '+' : ''}
              {stats.netMoney.toLocaleString()}
            </p>
          </div>
        </div>
      </Card>

      <AchievementBadges stats={{ ...stats, longestStreak: user?.longestStreak ?? 0 }} />

      <Card>
        <h3 className="mb-4 font-display font-semibold">Recent entries</h3>
        {recent.length === 0 ? (
          <EmptyState title="No entries yet" description="Log today's square to get started." />
        ) : (
          <div className="space-y-1">
            {recent.map((e) => (
              <Link
                key={e.date}
                to={`/entry/${e.date}`}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-ink/5"
              >
                <span className="text-sm text-ink/70">{formatLongDate(e.date)}</span>
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
                  style={{ backgroundColor: colorForRating(e.rating) }}
                >
                  {e.rating}/10
                </span>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Profile;
