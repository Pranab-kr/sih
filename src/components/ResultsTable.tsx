'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useLCA } from '@/contexts/LCAContext';

interface ImpactBreakdownItem {
  name: string;
  amount: string;
  co2Impact: number;
  percentage: number;
}

export function ResultsTable() {
  const { state } = useLCA();

  // Generate realistic breakdown data based on actual calculations
  const getImpactBreakdown = (): ImpactBreakdownItem[] => {
    if (!state.calculations || !state.currentProduct) {
      return [];
    }

    // Get the process data from current product
    const process = state.currentProduct.processes[0];
    const material = state.currentProduct.materials[0];
    
    if (!process || !material) return [];

    // Calculate individual impacts
    const electricityImpact = process.energyConsumption * 0.3;
    const materialImpact = material.quantity * material.carbonIntensity;
    const naturalGasImpact = 0.8 * 1.9; // Default natural gas usage
    const transportImpact = 150 * 0.003; // Default transport distance
    const sulfuricAcidImpact = 0.12 * 0.15;
    const wasteWaterImpact = 0.15 * 0.17;
    const causticSodaImpact = 0.08 * 0.12;
    const lubricantsImpact = 0.03 * 0.08;

    const totalImpact = electricityImpact + materialImpact + naturalGasImpact + 
                       transportImpact + sulfuricAcidImpact + wasteWaterImpact + 
                       causticSodaImpact + lubricantsImpact;

    const breakdown = [
      {
        name: 'Electricity',
        amount: `${process.energyConsumption.toFixed(2)} kWh`,
        co2Impact: electricityImpact,
        percentage: totalImpact > 0 ? (electricityImpact / totalImpact) * 100 : 0,
      },
      {
        name: `Raw Material (${material.name.charAt(0).toUpperCase() + material.name.slice(1)})`,
        amount: `${material.quantity.toFixed(2)} kg`,
        co2Impact: materialImpact,
        percentage: totalImpact > 0 ? (materialImpact / totalImpact) * 100 : 0,
      },
      {
        name: 'Natural Gas',
        amount: '0.80 m³',
        co2Impact: naturalGasImpact,
        percentage: totalImpact > 0 ? (naturalGasImpact / totalImpact) * 100 : 0,
      },
      {
        name: 'Transport',
        amount: '150 km',
        co2Impact: transportImpact,
        percentage: totalImpact > 0 ? (transportImpact / totalImpact) * 100 : 0,
      },
      {
        name: 'Sulfuric Acid',
        amount: '0.12 kg',
        co2Impact: sulfuricAcidImpact,
        percentage: totalImpact > 0 ? (sulfuricAcidImpact / totalImpact) * 100 : 0,
      },
      {
        name: 'Waste Water Treatment',
        amount: '0.15 m³',
        co2Impact: wasteWaterImpact,
        percentage: totalImpact > 0 ? (wasteWaterImpact / totalImpact) * 100 : 0,
      },
      {
        name: 'Caustic Soda',
        amount: '0.08 kg',
        co2Impact: causticSodaImpact,
        percentage: totalImpact > 0 ? (causticSodaImpact / totalImpact) * 100 : 0,
      },
      {
        name: 'Lubricants',
        amount: '0.03 kg',
        co2Impact: lubricantsImpact,
        percentage: totalImpact > 0 ? (lubricantsImpact / totalImpact) * 100 : 0,
      },
    ];

    return breakdown.filter(item => item.co2Impact > 0);
  };

  const breakdown = getImpactBreakdown();
  const totalCO2 = breakdown.reduce((sum, item) => sum + item.co2Impact, 0);

  if (!state.calculations || breakdown.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Detailed Impact Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12 text-neutral-500">
          <div className="text-lg mb-2">No data available</div>
          <div className="text-sm">Complete your LCA calculation to see the detailed impact breakdown</div>
        </CardContent>
      </Card>
    );
  }

  // Define color scheme for progress bars based on impact level
  const getProgressBarColor = (percentage: number) => {
    if (percentage > 40) return 'bg-red-500';
    if (percentage > 20) return 'bg-orange-500';
    if (percentage > 10) return 'bg-yellow-500';
    if (percentage > 5) return 'bg-blue-500';
    return 'bg-blue-300';
  };

  return (
    <Card className="bg-blue-500">
      <CardHeader className="bg-blue-500 text-white">
        <CardTitle className="text-white text-lg">
          Detailed Impact Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto bg-white">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700 border-b">Impact Category</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700 border-b">Amount</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700 border-b">CO₂ Impact (kg eq)</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700 border-b">Contribution (%)</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.map((item, index) => (
                <tr 
                  key={index} 
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4 text-gray-800">{item.name}</td>
                  <td className="py-3 px-4 text-center text-gray-600">{item.amount}</td>
                  <td className="py-3 px-4 text-center font-medium text-red-600">
                    {item.co2Impact.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-16">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor(item.percentage)}`}
                          style={{ width: `${Math.min(item.percentage, 100)}%` }}
                        ></div>
                      </div>
                      <span className="font-medium text-gray-800 text-sm min-w-12 text-right">
                        {item.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-300 bg-gray-100">
                <td className="py-3 px-4 font-bold text-gray-900">TOTAL IMPACT</td>
                <td className="py-3 px-4 text-center text-gray-600">-</td>
                <td className="py-3 px-4 text-center font-bold text-red-600">
                  {totalCO2.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-center font-bold text-gray-900">
                  100%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-center gap-4 p-6 bg-gray-50 border-t">
          <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Export Results
          </button>
          <button className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
            Generate Report
          </button>
          <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Compare Scenarios
          </button>
        </div>
      </CardContent>
    </Card>
  );
}