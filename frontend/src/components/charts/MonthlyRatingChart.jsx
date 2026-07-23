import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Card from '../ui/Card';
import ChartTooltip from './ChartTooltip';
import { EmptyChart } from './RatingTrendChart';
import { colorForRating } from '../../utils/ratingColors';
import { MONTH_SHORT } from '../../utils/dateHelpers';
import useChartColors from '../../hooks/useChartColors';

const MonthlyRatingChart = ({ data }) => {
  const hasData = data.some((d) => d.count > 0);
  const chartData = data.map((d) => ({ ...d, label: MONTH_SHORT[d.month - 1] }));
  const { axis, grid } = useChartColors();

  return (
    <Card>
      <h3 className="mb-4 font-display font-semibold">Monthly rating this year</h3>
      {!hasData ? (
        <EmptyChart />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: axis }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: axis }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip formatter={(p) => `Avg: ${p.value}/10`} />} />
            <Bar dataKey="avgRating" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.avgRating ? colorForRating(Math.round(entry.avgRating)) : '#3F4250'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};

export default MonthlyRatingChart;
