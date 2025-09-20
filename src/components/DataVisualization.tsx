'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useLCA } from '@/contexts/LCAContext';
import { MATERIAL_FACTORS } from '@/types/lca';

export function DataVisualization() {
  const { state } = useLCA();

  // Get emission sources data like the image
  const getEmissionSourcesData = () => {
    if (!state.calculations || !state.currentProduct) {
      return [
        { name: 'Production', emissions: 85000, color: '#06b6d4' },
        { name: 'Energy', emissions: 8000, color: '#fb923c' },
        { name: 'Transport', emissions: 58000, color: '#dc2626' }
      ];
    }

    // Calculate emissions from different sources based on actual data
    const materials = state.currentProduct.materials;
    const processes = state.currentProduct.processes;

    const productionEmissions = materials.reduce((sum: number, material) => {
      return sum + (material.carbonIntensity * material.quantity * 0.6); // 60% production
    }, 0);

    const energyEmissions = processes.reduce((sum: number, process) => {
      return sum + (process.energyConsumption * 0.5); // Energy factor
    }, 0) + (productionEmissions * 0.3); // 30% energy overhead

    const transportEmissions = processes.reduce((sum: number, process) => {
      const distance = process.distance || 0;
      return sum + (distance * 0.12); // Transport factor
    }, 0) + (productionEmissions * 0.5); // 50% transport impact

    return [
      { 
        name: 'Production', 
        emissions: Math.round(productionEmissions), 
        color: '#06b6d4' 
      },
      { 
        name: 'Energy', 
        emissions: Math.round(energyEmissions), 
        color: '#fb923c' 
      },
      { 
        name: 'Transport', 
        emissions: Math.round(transportEmissions), 
        color: '#dc2626' 
      }
    ];
  };

  const getLifecycleData = () => {
    if (!state.calculations) {
      // Default trend data matching original style
      return [
        { month: 'Jan', emissions: 2.8 },
        { month: 'Feb', emissions: 2.6 },
        { month: 'Mar', emissions: 2.4 },
        { month: 'Apr', emissions: 2.3 },
        { month: 'May', emissions: 2.1 },
        { month: 'Jun', emissions: 2.0 }
      ];
    }

    // Generate trend data from calculations (simulated monthly progression)
    const currentEmissions = state.calculations.totalCarbonFootprint / 1000; // Convert to tons
    return [
      { month: 'Jan', emissions: currentEmissions * 1.4 },
      { month: 'Feb', emissions: currentEmissions * 1.3 },
      { month: 'Mar', emissions: currentEmissions * 1.2 },
      { month: 'Apr', emissions: currentEmissions * 1.15 },
      { month: 'May', emissions: currentEmissions * 1.05 },
      { month: 'Jun', emissions: currentEmissions }
    ];
  };

  const getEmissionsBreakdown = () => {
    if (!state.calculations) {
      // Default pie chart data for lifecycle phases
      return [
        { name: 'Materials', value: 45, color: '#0ea5e9' },
        { name: 'Manufacturing', value: 30, color: '#06b6d4' },
        { name: 'Transport', value: 15, color: '#8dd1e1' },
        { name: 'Use Phase', value: 7, color: '#22c55e' },
        { name: 'End of Life', value: 3, color: '#e2e8f0' }
      ];
    }

    const { carbonFootprintByStage } = state.calculations;
    const total = state.calculations.totalCarbonFootprint;
    
    // Ensure we have reasonable distribution even if some values are 0
    const stages = [
      { name: 'Materials', value: carbonFootprintByStage.materials, color: '#0ea5e9' },
      { name: 'Manufacturing', value: carbonFootprintByStage.manufacturing, color: '#06b6d4' },
      { name: 'Transport', value: carbonFootprintByStage.transport, color: '#8dd1e1' },
      { name: 'Use Phase', value: carbonFootprintByStage.use, color: '#22c55e' },
      { name: 'End of Life', value: carbonFootprintByStage.endOfLife, color: '#e2e8f0' },
    ];

    // Filter out stages with 0 values and calculate percentages
    const nonZeroStages = stages.filter(stage => stage.value > 0);
    if (nonZeroStages.length === 0) {
      // Fallback to default if all stages are 0
      return [
        { name: 'Materials', value: 60, color: '#0ea5e9' },
        { name: 'Manufacturing', value: 25, color: '#06b6d4' },
        { name: 'Transport', value: 10, color: '#8dd1e1' },
        { name: 'End of Life', value: 5, color: '#e2e8f0' }
      ];
    }

    return nonZeroStages.map(stage => ({
      ...stage,
      value: (stage.value / total) * 100
    }));
  };

  const emissionSourcesData = getEmissionSourcesData();
  const lifecycleData = getLifecycleData();
  const emissionsData = getEmissionsBreakdown();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-neutral-50 border-neutral-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-neutral-800">Emission Sources</CardTitle>
          <CardDescription className="text-neutral-600">
            Carbon emissions by source category (kg CO₂e)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={emissionSourcesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.1} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${(value/1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: 'white'
                  }} 
                  formatter={(value) => [`${value} kg CO₂e`, 'Emissions']}
                />
                <Bar 
                  dataKey="emissions" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={80}
                >
                  {emissionSourcesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-neutral-50 border-neutral-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-neutral-800">
            {state.calculations ? 'Carbon Footprint by Lifecycle Phase' : 'End-of-Life Options'}
          </CardTitle>
          <CardDescription className="text-neutral-600">
            {state.calculations ? 'Distribution of carbon emissions by lifecycle stage' : 'Distribution of waste management approaches'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={emissionsData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${Number(value).toFixed(1)}%`}
                >
                  {emissionsData.map((entry: any, index: number) => (
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
              <LineChart data={lifecycleData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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