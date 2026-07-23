import { motion } from 'framer-motion';
import { Crown, Flame } from 'lucide-react';

const PODIUM_ORDER = [2, 1, 3]; // display order: 2nd, 1st, 3rd
const HEIGHTS = { 1: 'h-40', 2: 'h-32', 3: 'h-24' };
const RING = { 1: 'ring-flame', 2: 'ring-ink/30', 3: 'ring-orange-700/50' };

const Podium = ({ top3 }) => {
  const byRank = Object.fromEntries(top3.map((u) => [u.rank, u]));

  return (
    <div className="flex items-end justify-center gap-3 sm:gap-6">
      {PODIUM_ORDER.map((rank) => {
        const user = byRank[rank];
        if (!user) return <div key={rank} className="w-24 sm:w-32" />;
        return (
          <motion.div
            key={rank}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: rank * 0.1 }}
            className="flex w-24 flex-col items-center sm:w-32"
          >
            {rank === 1 && <Crown size={22} className="mb-1.5 text-flame" fill="#FF9F43" />}
            <div className={`relative h-14 w-14 overflow-hidden rounded-full ring-2 sm:h-16 sm:w-16 ${RING[rank]}`}>
              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
            </div>
            <p className="mt-2 truncate text-sm font-semibold">{user.name}</p>
            <p className="flex items-center gap-1 text-xs text-ink/50">
              <Flame size={12} className="text-flame" />
              {user.currentStreak}
            </p>
            <div
              className={`glass mt-3 flex w-full items-start justify-center rounded-t-xl2 pt-2 font-display text-2xl font-bold ${HEIGHTS[rank]}`}
            >
              {rank}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default Podium;
