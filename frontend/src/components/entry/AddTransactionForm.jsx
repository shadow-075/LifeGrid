import { useState } from 'react';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react';

const AddTransactionForm = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('earned');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const reset = () => {
    setAmount('');
    setNote('');
    setType('earned');
    setOpen(false);
  };

  const handleAdd = () => {
    const value = Number(amount);
    if (!value || value <= 0) return;
    onAdd({ type, amount: value, note: note.trim() });
    reset();
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="focus-ring flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-ink/20 py-2.5 text-sm font-medium text-ink/50 transition-colors hover:border-accent/50 hover:text-accent"
      >
        <Plus size={15} /> Add transaction
      </button>
    );
  }

  return (
    <div className="space-y-3 rounded-lg border border-ink/10 bg-ink/5 p-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setType('earned')}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors ${
            type === 'earned' ? 'bg-green-500/20 text-green-400' : 'bg-ink/5 text-ink/40'
          }`}
        >
          <TrendingUp size={14} /> Earned
        </button>
        <button
          type="button"
          onClick={() => setType('spent')}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors ${
            type === 'spent' ? 'bg-red-500/20 text-red-400' : 'bg-ink/5 text-ink/40'
          }`}
        >
          <TrendingDown size={14} /> Spent
        </button>
      </div>

      <input
        type="number"
        min="0"
        step="0.01"
        autoFocus
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
        placeholder="Amount"
        className="focus-ring w-full rounded-lg border border-ink/10 bg-ink/5 p-2.5 text-sm text-ink"
      />
      <input
        type="text"
        maxLength={200}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
        placeholder="Note (optional)"
        className="focus-ring w-full rounded-lg border border-ink/10 bg-ink/5 p-2.5 text-sm text-ink placeholder:text-ink/25"
      />

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleAdd}
          className="focus-ring flex-1 rounded-lg bg-accent py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          Add
        </button>
        <button
          type="button"
          onClick={reset}
          className="focus-ring rounded-lg border border-ink/10 px-4 py-2 text-sm text-ink/50 hover:bg-ink/10"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddTransactionForm;