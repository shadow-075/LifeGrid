import { Lightbulb } from 'lucide-react';
import Card from '../ui/Card';

const InsightsList = ({ insights }) => (
  <Card>
    <h3 className="mb-4 flex items-center gap-2 font-display font-semibold">
      <Lightbulb size={16} className="text-flame" />
      Insights
    </h3>
    {insights.length === 0 ? (
      <p className="text-sm text-ink/30">Log a few more days and insights will show up here.</p>
    ) : (
      <ul className="space-y-2.5">
        {insights.map((text, i) => (
          <li key={i} className="flex gap-2 text-sm text-ink/70">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
            {text}
          </li>
        ))}
      </ul>
    )}
  </Card>
);

export default InsightsList;
