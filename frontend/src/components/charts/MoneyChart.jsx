import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Card from '../ui/Card';
import ChartTooltip from './ChartTooltip';
import { EmptyChart } from './RatingTrendChart';
import useChartColors from '../../hooks/useChartColors';

const MoneyChart = ({ data }) => {
  const { axis, grid } = useChartColors();
  return (
  <Card>
    <h3 className="mb-4 font-display font-semibold">Money flow</h3>
    {data.length === 0 ? (
      <EmptyChart />
    ) : (
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={(d) => d.slice(5)}
            tick={{ fontSize: 10, fill: axis }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis tick={{ fontSize: 10, fill: axis }} axisLine={false} tickLine={false} />
          <Tooltip content={<ChartTooltip formatter={(p) => `${p.name}: ${Math.abs(p.value)}`} />} />
          <Legend wrapperStyle={{ fontSize: 11, opacity: 0.6 }} />
          <Bar dataKey="earned" name="Earned" fill="#10B981" radius={[3, 3, 0, 0]} />
          <Bar dataKey="spent" name="Spent" fill="#DC2626" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    )}
  </Card>
  );
};

export default MoneyChart;
