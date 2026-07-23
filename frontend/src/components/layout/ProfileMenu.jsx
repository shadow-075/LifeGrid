import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { User, Settings, Eye, EyeOff, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import * as profileService from '../../services/profileService';

const ProfileMenu = () => {
  const { user, logout, updateLocalUser } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const togglePublic = async () => {
    try {
      const data = await profileService.updateProfile({ isPublic: !user.isPublic });
      updateLocalUser({ isPublic: data.profile.isPublic });
      toast.success(data.profile.isPublic ? 'Profile is now public' : 'Profile is now private');
    } catch {
      toast.error('Could not update visibility');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="focus-ring block h-9 w-9 overflow-hidden rounded-full ring-2 ring-transparent transition-all hover:ring-accent/50"
      >
        <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="popover absolute right-0 mt-2 w-56 overflow-hidden rounded-xl shadow-glow"
          >
            <div className="border-b border-ink/10 px-4 py-3">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-xs text-ink/40">{user.email}</p>
            </div>
            <div className="p-1.5">
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink/80 hover:bg-ink/10"
              >
                <User size={15} /> Profile
              </Link>
              <Link
                to="/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink/80 hover:bg-ink/10"
              >
                <Settings size={15} /> Settings
              </Link>
              <button
                onClick={togglePublic}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-ink/80 hover:bg-ink/10"
              >
                {user.isPublic ? <Eye size={15} /> : <EyeOff size={15} />}
                {user.isPublic ? 'Public profile' : 'Private profile'}
              </button>
            </div>
            <div className="border-t border-ink/10 p-1.5">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/10"
              >
                <LogOut size={15} /> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileMenu;
