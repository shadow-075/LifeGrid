import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import Card from '../ui/Card';

const MoneyCard = ({ title, earned, spent, net, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay }}>
    <Card className="h-full">
      <div className="mb-4 flex items-center gap-2">
        <Wallet size={16} className="text-ink/40" />
        <p className="text-xs font-medium uppercase tracking-wide text-ink/40">{title}</p>
      </div>
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-sm text-ink/60">
            <TrendingUp size={14} style={{ color: '#22C55E' }} />
            Earned
          </span>
          <span className="font-semibold text-green-400">+{earned.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-sm text-ink/60">
            <TrendingDown size={14} style={{ color: '#DC2626' }} />
            Spent
          </span>
          <span className="font-semibold text-red-400">-{spent.toLocaleString()}</span>
        </div>
        <div className="my-2 h-px bg-ink/10" />
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-ink/70">Net</span>
          <span className={`font-bold ${net >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {net >= 0 ? '+' : ''}
            {net.toLocaleString()}
          </span>
        </div>
      </div>
    </Card>
  </motion.div>
);

export default MoneyCard;
