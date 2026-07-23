import { motion } from 'framer-motion';
import Card from '../ui/Card';

const StatCard = ({ icon: Icon, label, value, subvalue, accentColor = '#6C5CE7', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay }}
  >
    <Card className="h-full">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink/40">{label}</p>
          <p className="mt-2 font-display text-2xl sm:text-3xl font-bold text-ink">{value}</p>
          {subvalue && <p className="mt-1 text-xs text-ink/40">{subvalue}</p>}
        </div>
        {Icon && (
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${accentColor}22` }}
          >
            <Icon size={18} style={{ color: accentColor }} />
          </div>
        )}
      </div>
    </Card>
  </motion.div>
);

export default StatCard;
