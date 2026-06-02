import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency } from '../../utils/formatCurrency';

const IncomeChart = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  if (!data || data.length === 0) {
    return <div className="h-64 flex items-center justify-center text-gray-500">No data available</div>;
  }

  // Reverse data to show oldest to newest (left to right)
  const chartData = [...data].reverse();

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#e2e8f0'} />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
            tickFormatter={(value) => `₹${value >= 1000 ? (value/1000) + 'k' : value}`}
          />
          <Tooltip 
            cursor={{ fill: isDark ? '#1e293b' : '#f1f5f9' }}
            contentStyle={{ 
              backgroundColor: isDark ? '#0f172a' : '#fff',
              borderColor: isDark ? '#334155' : '#e2e8f0',
              borderRadius: '8px',
              color: isDark ? '#fff' : '#000'
            }}
            formatter={(value) => [formatCurrency(value), 'Income']}
          />
          <Bar 
            dataKey="income" 
            radius={[4, 4, 0, 0]}
            maxBarSize={50}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index === chartData.length - 1 ? '#2563EB' : '#93C5FD'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeChart;
