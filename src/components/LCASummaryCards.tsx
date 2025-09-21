'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Leaf, Package, Zap, Droplets } from 'lucide-react';
import { useLCA } from '@/contexts/LCAContext';

export function LCASummaryCards() {
  const { state } = useLCA();

  // Calculate summary data from LCA results
  const getSummaryData = () => {
    if (!state.calculations || !state.currentProduct) {
      return null;
    }

    const totalCO2 = state.calculations.totalCarbonFootprint;
    const primaryMaterial = state.currentProduct.materials.length > 0 ? 
                            state.currentProduct.materials[0].quantity : 0;
    const energyConsumption = state.calculations.energyConsumption;
    const waterUsage = state.calculations.waterUsage;
    
    const energyIntensity = primaryMaterial > 0 ? (energyConsumption / primaryMaterial) : 0;
    const waterFootprint = primaryMaterial > 0 ? (waterUsage / primaryMaterial) : 0;

    return [
      {
        title: 'TOTAL CO₂ IMPACT',
        value: totalCO2.toFixed(2),
        unit: 'kg CO₂ eq',
        icon: Leaf,
        color: 'text-emerald-600'
      },
      {
        title: 'PRIMARY MATERIAL',
        value: primaryMaterial.toFixed(2),
        unit: 'kg',
        icon: Package,
        color: 'text-blue-600'
      },
      {
        title: 'ENERGY INTENSITY',
        value: energyIntensity.toFixed(1),
        unit: 'kWh/kg',
        icon: Zap,
        color: 'text-amber-600'
      },
      {
        title: 'WATER FOOTPRINT',
        value: waterFootprint.toFixed(1),
        unit: 'liter/kg',
        icon: Droplets,
        color: 'text-cyan-600'
      }
    ];
  };

  const summaryData = getSummaryData();

  // Only render if we have calculated data
  if (!summaryData) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
      {summaryData.map((item) => {
        const IconComponent = item.icon;
        return (
          <Card key={item.title} className="bg-neutral-50 border-neutral-200 shadow-sm">
            <CardHeader className="pb-2 relative p-3 sm:p-4">
              <CardTitle className="text-xs text-neutral-500 uppercase tracking-wider pr-6">
                {item.title}
              </CardTitle>
              <IconComponent className={`h-4 w-4 ${item.color} absolute top-3 sm:top-4 right-3 sm:right-4`} />
            </CardHeader>
            <CardContent className="pt-0 p-3 sm:p-4">
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-light text-neutral-800">
                  {item.value}
                </div>
                <div className="text-xs sm:text-sm text-neutral-600">
                  {item.unit}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}