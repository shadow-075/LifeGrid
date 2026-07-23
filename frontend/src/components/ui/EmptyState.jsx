const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    {Icon && (
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-ink/5">
        <Icon size={24} className="text-ink/30" />
      </div>
    )}
    <h3 className="font-display text-lg font-semibold text-ink/80">{title}</h3>
    {description && <p className="mt-1.5 max-w-sm text-sm text-ink/40">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export default EmptyState;
