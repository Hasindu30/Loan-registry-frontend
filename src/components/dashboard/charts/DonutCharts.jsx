import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'WordPress', value: 1200 },
  { name: 'HTML', value: 1000 },
  { name: 'Joomla', value: 800 },
  { name: 'WooCommerce', value: 600 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const DonutChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={100}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend layout="horizontal" verticalAlign="bottom" align="center" />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DonutChart;
