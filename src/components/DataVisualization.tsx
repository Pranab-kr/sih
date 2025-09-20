"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const barChartData = [
  { name: 'Aluminum', raw: 8.2, recycled: 2.1 },
  { name: 'Steel', raw: 6.5, recycled: 1.8 },
  { name: 'Plastic', raw: 4.8, recycled: 2.9 },
  { name: 'Glass', raw: 3.2, recycled: 1.5 },
  { name: 'Paper', raw: 2.1, recycled: 0.8 }
];

const pieChartData = [
  { name: 'Recycling', value: 45, color: '#0ea5e9' },
  { name: 'Reuse', value: 25, color: '#06b6d4' },
  { name: 'Energy Recovery', value: 20, color: '#8dd1e1' },
  { name: 'Landfill', value: 10, color: '#e2e8f0' }
];

const lineChartData = [
  { month: 'Jan', emissions: 2.8 },
  { month: 'Feb', emissions: 2.6 },
  { month: 'Mar', emissions: 2.4 },
  { month: 'Apr', emissions: 2.3 },
  { month: 'May', emissions: 2.1 },
  { month: 'Jun', emissions: 2.0 }
];

export function DataVisualization() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-neutral-50 border-neutral-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-neutral-800">Raw vs Recycled Materials</CardTitle>
          <CardDescription className="text-neutral-600">
            CO₂ emissions comparison by material type (kg CO₂e/kg)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Legend />
                <Bar dataKey="raw" fill="#94a3b8" name="Raw Material" radius={[2, 2, 0, 0]} />
                <Bar dataKey="recycled" fill="#0ea5e9" name="Recycled" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-neutral-50 border-neutral-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-neutral-800">End-of-Life Options</CardTitle>
          <CardDescription className="text-neutral-600">
            Distribution of waste management approaches
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                  labelStyle={{ fontSize: 12, fill: '#374151' }}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 bg-neutral-50 border-neutral-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-neutral-800">CO₂ Emissions Trend</CardTitle>
          <CardDescription className="text-neutral-600">
            Monthly carbon emissions over time (tons CO₂e)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="emissions" 
                  stroke="#0ea5e9" 
                  strokeWidth={3}
                  dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#0ea5e9' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}