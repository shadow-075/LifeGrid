import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

const LeaderboardRow = ({ user, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: -8 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.25, delay }}
    className="flex items-center gap-4 rounded-xl px-3 py-2.5 transition-colors hover:bg-ink/5"
  >
    <span className="w-6 text-center text-sm font-semibold text-ink/40">{user.rank}</span>
    <img src={user.avatar} alt={user.name} className="h-9 w-9 rounded-full object-cover" />
    <span className="flex-1 truncate text-sm font-medium">{user.name}</span>
    <span className="flex items-center gap-1 text-xs text-ink/50">
      <Flame size={12} className="text-flame" />
      {user.currentStreak}
    </span>
    <span className="hidden w-16 text-right text-xs text-ink/40 sm:block">Best {user.longestStreak}</span>
    <span className="w-14 text-right text-sm font-semibold text-ink/70">{user.avgRating}/10</span>
  </motion.div>
);

export default LeaderboardRow;
