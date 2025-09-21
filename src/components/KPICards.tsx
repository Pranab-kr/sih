'use client';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Zap, Leaf, Recycle, TrendingUp, Droplets } from 'lucide-react';
import { useLCA } from '@/contexts/LCAContext';

export function KPICards() {
  const { state } = useLCA();

  const getKPIData = () => {
    if (!state.calculations) {
      return null;
    }

    // Calculate actual KPIs from the LCA results
    const { totalCarbonFootprint, energyConsumption, waterUsage, recyclabilityScore, sustainabilityScore } = state.calculations;
    
    // Calculate baselines based on material type and industry averages
    const primaryMaterial = state.currentProduct?.materials[0];
    const materialType = primaryMaterial?.type || 'other';
    
    // Industry baseline factors (kg CO2e per kg of material)
    const materialBaselines = {
      aluminum: 8.2,  // kg CO2e/kg
      steel: 2.9,
      plastic: 3.4,
      glass: 0.85,
      paper: 0.7,
      wood: -1.1,  // Carbon negative
      concrete: 0.11,
      other: 2.5
    };
    
    const materialQuantity = primaryMaterial?.quantity || 1;
    const baselineCO2 = materialBaselines[materialType] * materialQuantity;
    const baselineEnergy = materialQuantity * 15; // Baseline kWh/kg
    const baselineWater = materialQuantity * 25; // Baseline liters/kg
    
    const co2Change = ((totalCarbonFootprint - baselineCO2) / baselineCO2) * 100;
    const energyChange = ((energyConsumption - baselineEnergy) / baselineEnergy) * 100;
    const waterChange = ((waterUsage - baselineWater) / baselineWater) * 100;
    
    return [
      {
        title: 'CO₂ Emissions',
        value: (totalCarbonFootprint / 1000).toFixed(1),
        unit: 'tons CO₂e',
        change: `${co2Change > 0 ? '+' : ''}${co2Change.toFixed(0)}%`,
        trend: co2Change < -10 ? 'up' as const : co2Change > 10 ? 'down' as const : 'neutral' as const,
        icon: Leaf,
        color: 'text-emerald-600'
      },
      {
        title: 'Energy Use',
        value: energyConsumption.toFixed(0),
        unit: 'kWh',
        change: `${energyChange > 0 ? '+' : ''}${energyChange.toFixed(0)}%`,
        trend: energyChange < -10 ? 'up' as const : energyChange > 10 ? 'down' as const : 'neutral' as const,
        icon: Zap,
        color: 'text-amber-600'
      },
      {
        title: 'Water Usage',
        value: waterUsage > 1000 ? (waterUsage / 1000).toFixed(1) : waterUsage.toFixed(1),
        unit: waterUsage > 1000 ? 'k liters' : 'k liters',
        change: `${waterChange > 0 ? '+' : ''}${waterChange.toFixed(0)}%`,
        trend: waterChange < -10 ? 'up' as const : waterChange > 10 ? 'down' as const : 'neutral' as const,
        icon: Droplets,
        color: 'text-blue-600'
      },
      {
        title: 'Circularity Score',
        value: recyclabilityScore.toFixed(0),
        unit: '%',
        change: `${recyclabilityScore.toFixed(0)}% recycled`,
        trend: recyclabilityScore > 70 ? 'up' as const : recyclabilityScore < 30 ? 'down' as const : 'neutral' as const,
        icon: Recycle,
        color: 'text-sky-600'
      },
      {
        title: 'Sustainability Index',
        value: sustainabilityScore.toFixed(0),
        unit: '/100',
        change: `${sustainabilityScore > 70 ? 'Excellent' : sustainabilityScore > 50 ? 'Good' : sustainabilityScore > 30 ? 'Fair' : 'Poor'}`,
        trend: sustainabilityScore > 70 ? 'up' as const : sustainabilityScore < 30 ? 'down' as const : 'neutral' as const,
        icon: TrendingUp,
        color: 'text-green-600'
      }
    ];
  };

  const kpiData = getKPIData();

  // Only render if we have calculated data
  if (!kpiData) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
      {kpiData.map((kpi) => (
        <Card key={kpi.title} className="bg-neutral-50 border-neutral-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm text-neutral-600">
              {kpi.title}
              <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-medium text-neutral-800">{kpi.value}</span>
                <span className="text-sm text-neutral-500">{kpi.unit}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-xs ${kpi.trend === 'up' ? 'text-emerald-600' : kpi.trend === 'down' ? 'text-red-600' : 'text-neutral-500'}`}>
                  {kpi.change}
                </span>
                <span className="text-xs text-neutral-500">vs baseline</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}