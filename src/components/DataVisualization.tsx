'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useLCA } from '@/contexts/LCAContext';

export function DataVisualization() {
  const { state } = useLCA();

  const getEmissionsBreakdown = () => {
    if (!state.calculations) {
      return null;
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
      return null; // Don't show chart if no data
    }

    return nonZeroStages.map(stage => ({
      ...stage,
      value: (stage.value / total) * 100
    }));
  };

  const emissionsData = getEmissionsBreakdown();

  // Only render if we have calculated data
  if (!emissionsData) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-4 sm:mb-6">
      {/* Pie Chart for Emissions Breakdown */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg text-neutral-800">Carbon Footprint by Lifecycle Stage</CardTitle>
          <CardDescription className="text-sm sm:text-base text-neutral-600">
            Environmental impact distribution across product lifecycle phases
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={emissionsData}
                  cx="50%"
                  cy="50%"
                  outerRadius="70%"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${Number(value).toFixed(1)}%`}
                >
                  {emissionsData.map((entry: {name: string; value: number; color: string}, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#f5f5f5', 
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#374151'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}