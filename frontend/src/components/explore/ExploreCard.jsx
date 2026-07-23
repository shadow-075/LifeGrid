import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Star } from 'lucide-react';
import Card from '../ui/Card';
import { formatLongDate } from '../../utils/dateHelpers';

const ExploreCard = ({ profile, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay }}>
    <Link to={`/explore/${profile.username}`}>
      <Card className="flex items-center gap-4 transition-transform hover:-translate-y-0.5">
        <img src={profile.avatar} alt={profile.name} className="h-12 w-12 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{profile.name}</p>
          <p className="text-xs text-ink/40">Joined {formatLongDate(profile.joinedDate.slice(0, 10))}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="flex items-center gap-1 text-xs text-ink/60">
            <Flame size={12} className="text-flame" /> {profile.currentStreak}
          </span>
          <span className="flex items-center gap-1 text-xs text-ink/60">
            <Star size={12} className="text-yellow-400" /> {profile.avgRating}
          </span>
        </div>
      </Card>
    </Link>
  </motion.div>
);

export default ExploreCard;
