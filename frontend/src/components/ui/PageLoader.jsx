const PageLoader = ({ message }) => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-base px-4 text-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink/10 border-t-accent" />
    {message && <p className="max-w-xs text-sm text-ink/50">{message}</p>}
  </div>
);

export default PageLoader;