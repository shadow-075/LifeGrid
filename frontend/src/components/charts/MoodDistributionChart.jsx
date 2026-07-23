import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Card from '../ui/Card';
import ChartTooltip from './ChartTooltip';
import { EmptyChart } from './RatingTrendChart';
import { RATING_COLORS } from '../../utils/ratingColors';
import useChartColors from '../../hooks/useChartColors';

const MoodDistributionChart = ({ data }) => {
  const hasData = data.some((d) => d.count > 0);
  const { axis, grid } = useChartColors();
  return (
    <Card>
      <h3 className="mb-4 font-display font-semibold">Mood distribution</h3>
      {!hasData ? (
        <EmptyChart />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
            <XAxis dataKey="rating" tick={{ fontSize: 10, fill: axis }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: axis }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip formatter={(p) => `${p.value} day${p.value === 1 ? '' : 's'}`} />} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.rating} fill={RATING_COLORS[entry.rating]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};

export default MoodDistributionChart;
