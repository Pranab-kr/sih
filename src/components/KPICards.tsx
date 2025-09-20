'use client';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Zap, Leaf, Recycle, TrendingUp, Droplets } from 'lucide-react';
import { useLCA } from '@/contexts/LCAContext';

export function KPICards() {
  const { state } = useLCA();

  const getKPIData = () => {
    if (!state.calculations) {
      return [
        {
          title: 'CO₂ Emissions',
          value: '2.4',
          unit: 'tons CO₂e',
          change: '-12% vs baseline',
          trend: 'down' as const,
          icon: Leaf,
          color: 'text-emerald-600'
        },
        {
          title: 'Energy Use',
          value: '1,850',
          unit: 'kWh',
          change: '-8% vs baseline',
          trend: 'down' as const,
          icon: Zap,
          color: 'text-amber-600'
        },
        {
          title: 'Water Usage',
          value: '2,400',
          unit: 'liters',
          change: '-5% vs baseline',
          trend: 'down' as const,
          icon: Droplets,
          color: 'text-blue-600'
        },
        {
          title: 'Circularity Score',
          value: '78',
          unit: '%',
          change: '+15% vs baseline',
          trend: 'up' as const,
          icon: Recycle,
          color: 'text-sky-600'
        },
        {
          title: 'Sustainability Index',
          value: '82',
          unit: '/100',
          change: '+5% vs baseline',
          trend: 'up' as const,
          icon: TrendingUp,
          color: 'text-green-600'
        }
      ];
    }

    // Calculate actual KPIs from the LCA results
    const { totalCarbonFootprint, energyConsumption, waterUsage, recyclabilityScore, sustainabilityScore } = state.calculations;
    
    return [
      {
        title: 'CO₂ Emissions',
        value: (totalCarbonFootprint / 1000).toFixed(1),
        unit: 'tons CO₂e',
        change: '+0% vs baseline',
        trend: 'neutral' as const,
        icon: Leaf,
        color: 'text-emerald-600'
      },
      {
        title: 'Energy Use',
        value: energyConsumption.toFixed(0),
        unit: 'kWh',
        change: '+0% vs baseline',
        trend: 'neutral' as const,
        icon: Zap,
        color: 'text-amber-600'
      },
      {
        title: 'Water Usage',
        value: waterUsage > 1000 ? (waterUsage / 1000).toFixed(1) : waterUsage.toFixed(0),
        unit: waterUsage > 1000 ? 'k liters' : 'liters',
        change: '+0% vs baseline',
        trend: 'neutral' as const,
        icon: Droplets,
        color: 'text-blue-600'
      },
      {
        title: 'Circularity Score',
        value: recyclabilityScore.toFixed(0),
        unit: '%',
        change: '+0% vs baseline',
        trend: recyclabilityScore > 70 ? 'up' as const : 'down' as const,
        icon: Recycle,
        color: 'text-sky-600'
      },
      {
        title: 'Sustainability Index',
        value: sustainabilityScore.toFixed(0),
        unit: '/100',
        change: '+0% vs baseline',
        trend: sustainabilityScore > 70 ? 'up' as const : 'down' as const,
        icon: TrendingUp,
        color: 'text-green-600'
      }
    ];
  };

  const kpiData = getKPIData();

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