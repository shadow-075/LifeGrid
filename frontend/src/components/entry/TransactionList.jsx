import { TrendingUp, TrendingDown, X } from 'lucide-react';

// onRemove is optional - pass it to allow deleting a row (create/edit form),
// omit it for a purely read-only list (past entry detail view)
const TransactionList = ({ transactions, onRemove }) => {
  if (!transactions || transactions.length === 0) {
    return <p className="py-2 text-sm text-ink/30">No transactions logged for this day yet.</p>;
  }

  return (
    <div className="space-y-2">
      {transactions.map((t, i) => (
        <div key={i} className="flex items-start gap-3 rounded-lg bg-ink/5 px-3 py-2.5">
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
              t.type === 'earned' ? 'bg-green-500/15' : 'bg-red-500/15'
            }`}
          >
            {t.type === 'earned' ? (
              <TrendingUp size={14} className="text-green-400" />
            ) : (
              <TrendingDown size={14} className="text-red-400" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="break-words text-sm text-ink/80">{t.note || (t.type === 'earned' ? 'Earned' : 'Spent')}</p>
          </div>
          <span className={`shrink-0 font-semibold ${t.type === 'earned' ? 'text-green-400' : 'text-red-400'}`}>
            {t.type === 'earned' ? '+' : '-'}
            {Number(t.amount).toLocaleString()}
          </span>
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(i)}
              aria-label="Remove transaction"
              className="focus-ring shrink-0 rounded-full p-1 text-ink/25 hover:bg-ink/10 hover:text-red-400"
            >
              <X size={14} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default TransactionList;