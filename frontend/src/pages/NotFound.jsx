import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Compass } from 'lucide-react';

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-base px-4 text-center text-ink">
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
      <div className="mb-4 grid grid-cols-2 gap-1.5">
        {['#7F1D1D', '#EAB308', '#22C55E', '#3F4250'].map((c, i) => (
          <span key={i} className="h-8 w-8 rounded-lg" style={{ backgroundColor: c }} />
        ))}
      </div>
      <h1 className="font-display text-5xl font-bold">404</h1>
      <p className="mt-2 text-ink/50">This square doesn't exist on the grid.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link
          to="/"
          className="focus-ring flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
        >
          <Home size={16} /> Go home
        </Link>
        <Link
          to="/explore"
          className="focus-ring flex items-center gap-2 rounded-lg border border-ink/10 px-4 py-2.5 text-sm font-medium text-ink/70 hover:bg-ink/10"
        >
          <Compass size={16} /> Explore
        </Link>
      </div>
    </motion.div>
  </div>
);

export default NotFound;
