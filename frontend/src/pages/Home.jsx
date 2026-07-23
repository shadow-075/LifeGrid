import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarCheck, Flame, Trophy, BarChart3 } from 'lucide-react';
import Heatmap from '../components/heatmap/Heatmap';
import Card from '../components/ui/Card';
import StatCard from '../components/stats/StatCard';
import MoneyCard from '../components/stats/MoneyCard';
import MonthProgress from '../components/stats/MonthProgress';
import InsightsList from '../components/stats/InsightsList';
import RatingTrendChart from '../components/charts/RatingTrendChart';
import MoneyChart from '../components/charts/MoneyChart';
import MoodDistributionChart from '../components/charts/MoodDistributionChart';
import MonthlyRatingChart from '../components/charts/MonthlyRatingChart';
import WeeklyMoodChart from '../components/charts/WeeklyMoodChart';
import { HeatmapSkeleton, StatCardSkeleton, ChartSkeleton } from '../components/ui/Skeleton';
import { useAuth } from '../context/AuthContext';
import useYearEntries from '../hooks/useYearEntries';
import {
  daysLoggedThisMonth,
  avgWeeklyRating,
  avgMonthlyRating,
  weekMoneyStats,
  monthMoneyStats,
  ratingTrend,
  moneyTrend,
  moodDistribution,
  completionPercentage,
  monthlyAverages,
  buildInsights,
} from '../utils/stats';
import { daysInMonth as daysInMonthFn } from '../utils/dateHelpers';

const now = new Date();

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState('month');
  const [displayedYear, setDisplayedYear] = useState(now.getFullYear());
  const [displayedMonth, setDisplayedMonth] = useState(now.getMonth());

  const { entries, loading } = useYearEntries(displayedYear);

  const entryMap = useMemo(
    () => entries.reduce((acc, e) => ({ ...acc, [e.date]: e.rating }), {}),
    [entries]
  );

  const stats = useMemo(() => {
    const loggedThisMonth = daysLoggedThisMonth(entries, displayedYear, displayedMonth);
    return {
      loggedThisMonth,
      totalDaysThisMonth: daysInMonthFn(displayedYear, displayedMonth),
      avgWeekly: avgWeeklyRating(entries),
      avgMonthly: avgMonthlyRating(entries, displayedYear, displayedMonth),
      week: weekMoneyStats(entries),
      month: monthMoneyStats(entries, displayedYear, displayedMonth),
      completion: completionPercentage(entries, displayedYear, displayedMonth),
      trend: ratingTrend(entries, 30),
      moneyData: moneyTrend(entries, 30),
      mood: moodDistribution(entries),
      byMonth: monthlyAverages(entries, displayedYear),
      insights: buildInsights(entries),
    };
  }, [entries, displayedYear, displayedMonth]);

  const handleDayClick = (dateKey) => navigate(`/entry/${dateKey}`);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">
          Hey {user?.name?.split(' ')[0]}, here's your grid
        </h1>
        <p className="mt-1 text-sm text-ink/40">Tap any day to log or review it.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left - heatmap */}
        <Card className="lg:col-span-3 flex flex-col">
          {loading ? (
            <HeatmapSkeleton />
          ) : (
            <Heatmap
              year={displayedYear}
              month={displayedMonth}
              entries={entries}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onMonthChange={setDisplayedMonth}
              onYearChange={setDisplayedYear}
              onDayClick={handleDayClick}
            />
          )}
        </Card>

        {/* Right - statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-2">
          {loading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <StatCard
                icon={CalendarCheck}
                label="Days logged"
                value={`${stats.loggedThisMonth} / ${stats.totalDaysThisMonth}`}
                subvalue="This month"
                accentColor="#6C5CE7"
              />
              <StatCard icon={Flame} label="Current streak" value={user?.currentStreak ?? 0} accentColor="#FF9F43" delay={0.05} />
              <StatCard icon={Trophy} label="Longest streak" value={user?.longestStreak ?? 0} accentColor="#EAB308" delay={0.1} />
              <StatCard
                icon={BarChart3}
                label="Avg rating"
                value={`${stats.avgMonthly}/10`}
                subvalue={`Weekly avg ${stats.avgWeekly}/10`}
                accentColor="#10B981"
                delay={0.15}
              />
              <MoneyCard title="This week" earned={stats.week.earned} spent={stats.week.spent} net={stats.week.net} delay={0.2} />
              <MoneyCard title="This month" earned={stats.month.earned} spent={stats.month.spent} net={stats.month.net} delay={0.25} />
            </>
          )}
        </div>
      </div>

      {/* Analytics */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <ChartSkeleton />
          <ChartSkeleton />
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <MonthProgress percentage={stats.completion} daysLogged={stats.loggedThisMonth} totalDays={stats.totalDaysThisMonth} />
            <WeeklyMoodChart entryMap={entryMap} />
            <InsightsList insights={stats.insights} />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <RatingTrendChart data={stats.trend} />
            <MoneyChart data={stats.moneyData} />
            <MoodDistributionChart data={stats.mood} />
            <MonthlyRatingChart data={stats.byMonth} />
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
