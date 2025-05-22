import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SensorChart = ({ data, parameter, color }) => {
  return (
    <div className='chart-container' style={{ padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
      <h2 style={{ textAlign: "center", color: color }}>
        {parameter === 'temperature' ? 'Temperature Trends' : 'Gas Level Trends'}
      </h2>
      <ResponsiveContainer width='100%' height={300}>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='timestamp' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type='monotone' dataKey={parameter} stroke={color} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SensorChart;
