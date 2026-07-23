import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Save } from 'lucide-react';
import RatingSlider from './RatingSlider';
import Card from '../ui/Card';

const draftKey = (date) => `lifegrid_draft_${date}`;

const EntryForm = ({ date, initialData, onSubmit, onDelete, submitting }) => {
  const [rating, setRating] = useState(initialData?.rating ?? 5);
  const [diary, setDiary] = useState(initialData?.diary ?? '');
  const [earned, setEarned] = useState(initialData?.earned ?? 0);
  const [spent, setSpent] = useState(initialData?.spent ?? 0);
  const [moneyNote, setMoneyNote] = useState(initialData?.moneyNote ?? '');

  // Restore an unsaved draft only when there's no existing entry yet
  useEffect(() => {
    if (initialData) return;
    const raw = localStorage.getItem(draftKey(date));
    if (raw) {
      try {
        const draft = JSON.parse(raw);
        setRating(draft.rating ?? 5);
        setDiary(draft.diary ?? '');
        setEarned(draft.earned ?? 0);
        setSpent(draft.spent ?? 0);
        setMoneyNote(draft.moneyNote ?? '');
      } catch {
        // ignore corrupt draft
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  // Autosave draft every time an untouched field changes, debounced lightly via effect
  useEffect(() => {
    if (initialData) return;
    const timeout = setTimeout(() => {
      localStorage.setItem(draftKey(date), JSON.stringify({ rating, diary, earned, spent, moneyNote }));
    }, 400);
    return () => clearTimeout(timeout);
  }, [rating, diary, earned, spent, moneyNote, date, initialData]);

  const net = (Number(earned) || 0) - (Number(spent) || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.removeItem(draftKey(date));
    onSubmit({
      date,
      rating,
      diary,
      earned: Number(earned) || 0,
      spent: Number(spent) || 0,
      moneyNote,
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <Card>
        <RatingSlider value={rating} onChange={setRating} />
      </Card>

      <Card>
        <label className="mb-2 block text-sm font-medium text-ink/60">Diary</label>
        <textarea
          value={diary}
          onChange={(e) => setDiary(e.target.value)}
          rows={8}
          maxLength={5000}
          placeholder="What happened today?"
          className="focus-ring w-full resize-none rounded-lg border border-ink/10 bg-ink/5 p-3 text-sm text-ink placeholder:text-ink/25"
        />
        <p className="mt-1 text-right text-xs text-ink/25">{diary.length}/5000</p>
      </Card>

      <Card>
        <label className="mb-3 block text-sm font-medium text-ink/60">Money</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs text-ink/40">Earned</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={earned}
              onChange={(e) => setEarned(e.target.value)}
              className="focus-ring w-full rounded-lg border border-ink/10 bg-ink/5 p-2.5 text-sm text-ink"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-ink/40">Spent</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={spent}
              onChange={(e) => setSpent(e.target.value)}
              className="focus-ring w-full rounded-lg border border-ink/10 bg-ink/5 p-2.5 text-sm text-ink"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="mb-1 block text-xs text-ink/40">Note</label>
          <input
            type="text"
            maxLength={200}
            value={moneyNote}
            onChange={(e) => setMoneyNote(e.target.value)}
            placeholder="What was it for?"
            className="focus-ring w-full rounded-lg border border-ink/10 bg-ink/5 p-2.5 text-sm text-ink placeholder:text-ink/25"
          />
        </div>
        <div className="mt-4 flex items-center justify-between rounded-lg bg-ink/5 px-3 py-2">
          <span className="text-sm text-ink/60">Net</span>
          <span className={`font-bold ${net >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {net >= 0 ? '+' : ''}
            {net.toLocaleString()}
          </span>
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="focus-ring flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
        >
          <Save size={16} />
          {submitting ? 'Saving...' : initialData ? 'Save changes' : 'Create entry'}
        </button>
        {initialData && onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="focus-ring flex items-center gap-2 rounded-lg border border-red-500/30 px-4 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
          >
            <Trash2 size={16} />
            Delete
          </button>
        )}
      </div>
    </motion.form>
  );
};

export default EntryForm;
