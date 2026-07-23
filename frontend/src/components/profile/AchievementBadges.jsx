import { Flame, Award, Star, Gem, Trophy, Sparkles } from 'lucide-react';
import Card from '../ui/Card';

const ACHIEVEMENTS = [
  { id: 'streak3', icon: Flame, label: '3 Day Streak', check: (s) => s.longestStreak >= 3 },
  { id: 'streak7', icon: Flame, label: '7 Day Streak', check: (s) => s.longestStreak >= 7 },
  { id: 'streak30', icon: Trophy, label: '30 Day Streak', check: (s) => s.longestStreak >= 30 },
  { id: 'entries10', icon: Star, label: '10 Entries', check: (s) => s.totalEntries >= 10 },
  { id: 'entries100', icon: Gem, label: '100 Entries', check: (s) => s.totalEntries >= 100 },
  { id: 'highAvg', icon: Award, label: 'Avg Rating 8+', check: (s) => s.avgRating >= 8 },
  { id: 'positiveNet', icon: Sparkles, label: 'Net Positive', check: (s) => s.netMoney > 0 },
];

const AchievementBadges = ({ stats }) => (
  <Card>
    <h3 className="mb-4 font-display font-semibold">Achievements</h3>
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
      {ACHIEVEMENTS.map(({ id, icon: Icon, label, check }) => {
        const unlocked = check(stats);
        return (
          <div
            key={id}
            className={`flex flex-col items-center gap-2 rounded-xl p-3 text-center transition-opacity ${
              unlocked ? 'bg-accent/10' : 'opacity-30'
            }`}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                unlocked ? 'bg-accent/20' : 'bg-ink/5'
              }`}
            >
              <Icon size={18} className={unlocked ? 'text-accent' : 'text-ink/40'} />
            </div>
            <span className="text-[11px] leading-tight text-ink/70">{label}</span>
          </div>
        );
      })}
    </div>
  </Card>
);

export default AchievementBadges;
