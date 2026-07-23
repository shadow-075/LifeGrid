import { Check } from 'lucide-react';

// A fixed set of seeds so the same 12 avatars show up every time (Chrome-profile style)
const SEEDS = [
  'Sunny', 'Milo', 'Nova', 'Pepper', 'Juno', 'Kiwi',
  'Ziggy', 'Luna', 'Otto', 'Sage', 'Remy', 'Finn',
];

const avatarUrl = (seed) => `https://api.dicebear.com/10.x/thumbs/svg?seed=${seed}`;

const AvatarPicker = ({ value, onChange }) => (
  <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
    {SEEDS.map((seed) => {
      const url = avatarUrl(seed);
      const selected = value === url;
      return (
        <button
          key={seed}
          type="button"
          onClick={() => onChange(url)}
          className={`focus-ring relative aspect-square overflow-hidden rounded-xl border-2 transition-all ${
            selected ? 'border-accent' : 'border-transparent hover:border-ink/20'
          }`}
        >
          <img src={url} alt={seed} className="h-full w-full bg-ink/5 object-cover" />
          {selected && (
            <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent">
              <Check size={12} className="text-white" />
            </span>
          )}
        </button>
      );
    })}
  </div>
);

export default AvatarPicker;
