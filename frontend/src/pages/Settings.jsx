import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import AvatarPicker from '../components/profile/AvatarPicker';
import { useAuth } from '../context/AuthContext';
import * as profileService from '../services/profileService';

const Settings = () => {
  const { user, updateLocalUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [isPublic, setIsPublic] = useState(user?.isPublic ?? true);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await profileService.updateProfile({ name, bio, avatar, isPublic });
      updateLocalUser(data.profile);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-display text-2xl font-bold">Settings</h1>

      <motion.form initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSave} className="space-y-6">
        <Card>
          <label className="mb-3 block text-sm font-medium text-ink/60">Choose an avatar</label>
          <AvatarPicker value={avatar} onChange={setAvatar} />
        </Card>

        <Card>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink/50">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={40}
                className="focus-ring w-full rounded-lg border border-ink/10 bg-ink/5 p-2.5 text-sm text-ink"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink/50">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={160}
                rows={3}
                placeholder="A short line about you"
                className="focus-ring w-full resize-none rounded-lg border border-ink/10 bg-ink/5 p-2.5 text-sm text-ink placeholder:text-ink/25"
              />
            </div>
          </div>
        </Card>

        <Card>
          <button
            type="button"
            onClick={() => setIsPublic((p) => !p)}
            className="flex w-full items-center justify-between"
          >
            <div className="text-left">
              <p className="text-sm font-medium">Public profile</p>
              <p className="text-xs text-ink/40">Anyone can find you on the Explore page and read your diary</p>
            </div>
            <div className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors ${isPublic ? 'bg-accent justify-end' : 'bg-ink/15 justify-start'}`}>
              <motion.div layout className="flex h-5 w-5 items-center justify-center rounded-full bg-white">
                {isPublic ? <Eye size={11} className="text-accent" /> : <EyeOff size={11} className="text-ink/50" />}
              </motion.div>
            </div>
          </button>
        </Card>

        <button
          type="submit"
          disabled={saving}
          className="focus-ring flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </motion.form>
    </div>
  );
};

export default Settings;
