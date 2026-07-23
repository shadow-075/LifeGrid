import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../ui/Card';
import ChartTooltip from './ChartTooltip';
import useChartColors from '../../hooks/useChartColors';

const RatingTrendChart = ({ data }) => {
  const { axis, grid } = useChartColors();
  return (
  <Card>
    <h3 className="mb-4 font-display font-semibold">Rating trend</h3>
    {data.length === 0 ? (
      <EmptyChart />
    ) : (
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={(d) => d.slice(5)}
            tick={{ fontSize: 10, fill: axis }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 10]}
            tick={{ fontSize: 10, fill: axis }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<ChartTooltip formatter={(p) => `Rating: ${p.value}/10`} />} />
          <Line
            type="monotone"
            dataKey="rating"
            stroke="#6C5CE7"
            strokeWidth={2}
            dot={{ r: 3, fill: '#6C5CE7' }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    )}
  </Card>
  );
};

export const EmptyChart = () => (
  <div className="flex h-[220px] items-center justify-center text-sm text-ink/30">
    Not enough data yet - log a few days to see this chart
  </div>
);

export default RatingTrendChart;
