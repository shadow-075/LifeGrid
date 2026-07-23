import { AlertTriangle, RotateCcw } from 'lucide-react';

const ErrorPage = ({ error, onReset }) => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-base px-4 text-center text-ink">
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/15">
      <AlertTriangle size={26} className="text-red-400" />
    </div>
    <h1 className="font-display text-2xl font-bold">Something went wrong</h1>
    <p className="mt-2 max-w-sm text-sm text-ink/50">
      {error?.message || 'An unexpected error occurred. Try refreshing the page.'}
    </p>
    <button
      onClick={onReset}
      className="focus-ring mt-6 flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
    >
      <RotateCcw size={16} /> Reload
    </button>
  </div>
);

export default ErrorPage;
