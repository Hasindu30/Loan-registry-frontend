import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Jan', visitors: 400 },
  { name: 'Feb', visitors: 300 },
  { name: 'Mar', visitors: 500 },
  { name: 'Apr', visitors: 700 },
  { name: 'May', visitors: 600 },
  { name: 'Jun', visitors: 800 },
];

const LineChartComponent = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="visitors" stroke="#8884d8" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;
