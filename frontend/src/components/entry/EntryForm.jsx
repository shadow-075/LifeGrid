import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Save } from 'lucide-react';
import RatingSlider from './RatingSlider';
import TransactionList from './TransactionList';
import AddTransactionForm from './AddTransactionForm';
import Card from '../ui/Card';

const draftKey = (date) => `lifegrid_draft_${date}`;

const EntryForm = ({ date, initialData, onSubmit, onDelete, submitting }) => {
  const [rating, setRating] = useState(initialData?.rating ?? 5);
  const [diary, setDiary] = useState(initialData?.diary ?? '');
  const [transactions, setTransactions] = useState(initialData?.transactions ?? []);

  useEffect(() => {
    if (initialData) return;
    const raw = localStorage.getItem(draftKey(date));
    if (raw) {
      try {
        const draft = JSON.parse(raw);
        setRating(draft.rating ?? 5);
        setDiary(draft.diary ?? '');
        setTransactions(draft.transactions ?? []);
      } catch {
        // ignore corrupt draft
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  useEffect(() => {
    if (initialData) return;
    const timeout = setTimeout(() => {
      localStorage.setItem(draftKey(date), JSON.stringify({ rating, diary, transactions }));
    }, 400);
    return () => clearTimeout(timeout);
  }, [rating, diary, transactions, date, initialData]);

  const totalEarned = transactions.filter((t) => t.type === 'earned').reduce((sum, t) => sum + Number(t.amount), 0);
  const totalSpent = transactions.filter((t) => t.type === 'spent').reduce((sum, t) => sum + Number(t.amount), 0);
  const net = totalEarned - totalSpent;

  const handleAddTransaction = (t) => setTransactions((prev) => [...prev, t]);
  const handleRemoveTransaction = (index) => setTransactions((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.removeItem(draftKey(date));
    onSubmit({ date, rating, diary, transactions });
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

        <TransactionList transactions={transactions} onRemove={handleRemoveTransaction} />

        <div className="mt-3">
          <AddTransactionForm onAdd={handleAddTransaction} />
        </div>

        <div className="mt-4 space-y-2 rounded-lg bg-ink/5 p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink/60">Total earned</span>
            <span className="font-semibold text-green-400">+{totalEarned.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink/60">Total spent</span>
            <span className="font-semibold text-red-400">-{totalSpent.toLocaleString()}</span>
          </div>
          <div className="my-1 h-px bg-ink/10" />
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-ink/70">Net</span>
            <span className={`font-bold ${net >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {net >= 0 ? '+' : ''}
              {net.toLocaleString()}
            </span>
          </div>
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