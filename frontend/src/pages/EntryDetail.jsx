import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Lock, FileX } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import EntryForm from '../components/entry/EntryForm';
import TransactionList from '../components/entry/TransactionList';
import PageLoader from '../components/ui/PageLoader';
import * as entryService from '../services/entryService';
import useYearEntries from '../hooks/useYearEntries';
import { useAuth } from '../context/AuthContext';
import { colorForRating, RATING_LABELS } from '../utils/ratingColors';
import { formatLongDate } from '../utils/dateHelpers';
import { fireConfetti, isMilestone } from '../utils/confetti';

const EntryDetail = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const { updateLocalUser } = useAuth();
  const year = parseInt(date.slice(0, 4), 10);
  const { refresh } = useYearEntries(year);

  const [entry, setEntry] = useState(null);
  const [editable, setEditable] = useState(false);
  const [isFuture, setIsFuture] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    entryService
      .getEntryByDate(date)
      .then((data) => {
        setEntry(data.entry);
        setEditable(data.editable);
        setIsFuture(data.isFuture);
      })
      .catch(() => toast.error('Could not load this day'))
      .finally(() => setLoading(false));
  }, [date]);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    try {
      const data = entry
        ? await entryService.updateEntry(date, payload)
        : await entryService.createEntry(payload);

      setEntry(data.entry);
      updateLocalUser({ currentStreak: data.streaks.currentStreak, longestStreak: data.streaks.longestStreak });
      refresh();
      toast.success(entry ? 'Entry updated' : 'Entry created');

      if (!entry && isMilestone(data.streaks.currentStreak)) {
        fireConfetti();
        toast.success(`${data.streaks.currentStreak} day streak! Keep it up.`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this entry? This cannot be undone.')) return;
    try {
      const data = await entryService.deleteEntry(date);
      updateLocalUser({ currentStreak: data.streaks.currentStreak, longestStreak: data.streaks.longestStreak });
      refresh();
      toast.success('Entry deleted');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete entry');
    }
  };

  const header = (
    <div className="mb-6 flex items-center gap-3">
      <button
        onClick={() => navigate(-1)}
        className="focus-ring rounded-lg p-2 text-ink/50 hover:bg-ink/10 hover:text-ink"
      >
        <ArrowLeft size={18} />
      </button>
      <div>
        <h1 className="font-display text-xl font-bold sm:text-2xl">{formatLongDate(date)}</h1>
        {!isFuture && !editable && (
          <p className="flex items-center gap-1 text-xs text-ink/40">
            <Lock size={11} /> Read-only
          </p>
        )}
      </div>
    </div>
  );

  if (loading) return <PageLoader />;

  if (isFuture) {
    return (
      <div className="mx-auto max-w-2xl">
        {header}
        <Card>
          <EmptyState
            icon={Clock}
            title="This day hasn't happened yet"
            description="You can't log an entry for a future date. Come back when it arrives."
          />
        </Card>
      </div>
    );
  }

  if (editable) {
    return (
      <div className="mx-auto max-w-2xl">
        {header}
        <EntryForm date={date} initialData={entry} onSubmit={handleSubmit} onDelete={entry ? handleDelete : undefined} submitting={submitting} />
      </div>
    );
  }

  // Read-only past day
  if (!entry) {
    return (
      <div className="mx-auto max-w-2xl">
        {header}
        <Card>
          <EmptyState
            icon={FileX}
            title="No entry for this day"
            description="This day has passed and no entry was logged, so it can no longer be added."
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {header}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink/50">Rating</span>
            <span
              className="rounded-full px-3 py-1 text-sm font-bold text-white"
              style={{ backgroundColor: colorForRating(entry.rating) }}
            >
              {entry.rating}/10 · {RATING_LABELS[entry.rating]}
            </span>
          </div>
        </Card>

        <Card>
          <h3 className="mb-2 text-sm font-medium text-ink/50">Diary</h3>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink/80">
            {entry.diary || <span className="text-ink/30">No diary entry was written.</span>}
          </p>
        </Card>

        <Card>
          <h3 className="mb-3 text-sm font-medium text-ink/50">Money</h3>
          <TransactionList transactions={entry.transactions} />
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xs text-ink/40">Earned</p>
              <p className="font-semibold text-green-400">+{entry.earned}</p>
            </div>
            <div>
              <p className="text-xs text-ink/40">Spent</p>
              <p className="font-semibold text-red-400">-{entry.spent}</p>
            </div>
            <div>
              <p className="text-xs text-ink/40">Net</p>
              <p className={`font-semibold ${entry.net >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {entry.net >= 0 ? '+' : ''}
                {entry.net}
              </p>
            </div>
          </div>
        </Card>

        <p className="text-center text-xs text-ink/30">
          Created {new Date(entry.createdAt).toLocaleString()} · Updated {new Date(entry.updatedAt).toLocaleString()}
        </p>
      </motion.div>
    </div>
  );
};

export default EntryDetail;
