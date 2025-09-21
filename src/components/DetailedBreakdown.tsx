"use client";

import { useLCA } from "../contexts/LCAContext";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface BreakdownItem {
  name: string;
  amount: string;
  co2Impact: number;
  percentage: number;
}

export function DetailedBreakdown() {
  const { state } = useLCA();

  const getDetailedBreakdown = (): BreakdownItem[] => {
    if (!state.calculations || !state.currentProduct) {
      return [];
    }

    const {
      energyConsumption,
      waterUsage,
      carbonFootprintByStage,
    } = state.calculations;

    // Get material quantity for scaling calculations
    const materialQuantity = state.currentProduct.materials[0]?.quantity || 1;
    
    // Calculate individual impacts based on realistic LCA data and production scale
    const electricityImpact = energyConsumption * 0.3; // kWh to CO2 conversion (0.3 kg CO2/kWh grid factor)
    const materialImpact = carbonFootprintByStage.materials;
    const naturalGasImpact = energyConsumption * 0.12; // Natural gas portion of energy mix
    
    // More realistic transport impact (0.1 kg CO2 per ton-km, assuming 1 ton cargo)
    const transportImpact = Math.max(carbonFootprintByStage.transport, (150 * materialQuantity * 0.0001));
    
    // Chemical impacts based on production scale (typical chemical usage per kg of product)
    const sulfuricAcidQuantity = materialQuantity * 0.05; // 5% of material weight
    const causticSodaQuantity = materialQuantity * 0.03; // 3% of material weight  
    const lubricantQuantity = materialQuantity * 0.01; // 1% of material weight
    
    const sulfuricAcidImpact = sulfuricAcidQuantity * 0.15; // 0.15 kg CO2 per kg sulfuric acid
    const causticSodaImpact = causticSodaQuantity * 0.12; // 0.12 kg CO2 per kg caustic soda
    const lubricantImpact = lubricantQuantity * 0.08; // 0.08 kg CO2 per kg lubricant
    
    // Water treatment impact (realistic factor)
    const wasteWaterImpact = waterUsage * 0.002; // 0.002 kg CO2 per liter water treatment

    // First, create items without percentages
    const rawItems: Omit<BreakdownItem, 'percentage'>[] = [
      {
        name: "Electricity",
        amount: `${energyConsumption.toFixed(2)} kWh`,
        co2Impact: electricityImpact,
      },
      {
        name: `Raw Material (${
          state.currentProduct.materials[0]?.name || "Material"
        })`,
        amount: `${
          state.currentProduct.materials[0]?.quantity.toFixed(2) || "0.00"
        } kg`,
        co2Impact: materialImpact,
      },
      {
        name: "Natural Gas",
        amount: `${(energyConsumption * 0.064).toFixed(2)} m³`,
        co2Impact: naturalGasImpact,
      },
      {
        name: "Transport",
        amount: "150 km",
        co2Impact: transportImpact,
      },
      {
        name: "Sulfuric Acid",
        amount: `${sulfuricAcidQuantity.toFixed(2)} kg`,
        co2Impact: sulfuricAcidImpact,
      },
      {
        name: "Waste Water Treatment",
        amount: `${(waterUsage * 0.01).toFixed(2)} m³`,
        co2Impact: wasteWaterImpact,
      },
      {
        name: "Caustic Soda",
        amount: `${causticSodaQuantity.toFixed(2)} kg`,
        co2Impact: causticSodaImpact,
      },
      {
        name: "Lubricants",
        amount: `${lubricantQuantity.toFixed(2)} kg`,
        co2Impact: lubricantImpact,
      },
    ];

    // Calculate the total from our breakdown items
    const breakdownTotal = rawItems.reduce((sum, item) => sum + item.co2Impact, 0);
    
    // Now calculate percentages based on our breakdown total
    const breakdownItems: BreakdownItem[] = rawItems.map(item => ({
      ...item,
      percentage: breakdownTotal > 0 ? (item.co2Impact / breakdownTotal) * 100 : 0,
    }));

    // Sort by CO2 impact descending
    return breakdownItems.sort((a, b) => b.co2Impact - a.co2Impact);
  };

  const breakdownData = getDetailedBreakdown();
  
  // Calculate the total CO2 from our breakdown data
  const breakdownTotal = breakdownData.reduce((sum, item) => sum + item.co2Impact, 0);

  if (!state.calculations) {
    return null;
  }

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 30) return "bg-red-500";
    if (percentage >= 20) return "bg-orange-500";
    if (percentage >= 10) return "bg-yellow-500";
    if (percentage >= 5) return "bg-blue-500";
    return "bg-gray-400";
  };

  return (
    <Card className="mb-4 sm:mb-6">
      <CardHeader className="bg-neutral-600 rounded-t-2xl pb-3 text-white p-4 sm:p-6">
        <CardTitle className="text-base sm:text-lg font-medium">
          Detailed Impact Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left p-2 sm:p-4 font-medium text-gray-700 text-xs sm:text-sm">
                  Impact Category
                </th>
                <th className="text-center p-2 sm:p-4 font-medium text-gray-700 text-xs sm:text-sm">
                  Amount
                </th>
                <th className="text-center p-2 sm:p-4 font-medium text-gray-700 text-xs sm:text-sm">
                  CO₂ Impact (kg eq)
                </th>
                <th className="text-center p-2 sm:p-4 font-medium text-gray-700 text-xs sm:text-sm">
                  Contribution (%)
                </th>
              </tr>
            </thead>
            <tbody>
              {breakdownData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-2 sm:p-4 font-medium text-gray-800 text-xs sm:text-sm">{item.name}</td>
                  <td className="p-2 sm:p-4 text-center text-gray-600 text-xs sm:text-sm">
                    {item.amount}
                  </td>
                  <td className="p-2 sm:p-4 text-center font-medium text-red-600 text-xs sm:text-sm">
                    {item.co2Impact.toFixed(2)}
                  </td>
                  <td className="p-2 sm:p-4 text-center">
                    <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                      <div className="flex-1 max-w-16 sm:max-w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getProgressBarColor(
                            item.percentage
                          )}`}
                          style={{
                            width: `${Math.min(item.percentage, 100)}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-gray-700 min-w-8 sm:min-w-12">
                        {item.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 border-t-2 border-neutral-200-100">
                <td className="p-2 sm:p-4 font-bold text-gray-800 text-xs sm:text-sm">TOTAL IMPACT</td>
                <td className="p-2 sm:p-4 text-center text-gray-600 text-xs sm:text-sm">
                  {state.currentProduct?.materials[0]?.quantity.toFixed(2)} kg product
                </td>
                <td className="p-2 sm:p-4 text-center font-bold text-gray-800 text-xs sm:text-sm">
                  {breakdownTotal.toFixed(2)}
                </td>
                <td className="p-2 sm:p-4 text-center font-bold text-gray-800 text-xs sm:text-sm">
                  100%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Action Buttons Section */}
        <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-all duration-200 hover:shadow-lg text-sm sm:text-base"
              onClick={() => console.log("Export Results clicked")}
            >
              Export Results
            </button>
            <button
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-all duration-200 hover:shadow-lg text-sm sm:text-base"
              onClick={() => console.log("Generate Report clicked")}
            >
              Generate Report
            </button>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-all duration-200 hover:shadow-lg text-sm sm:text-base"
              onClick={() => console.log("Compare Scenarios clicked")}
            >
              Compare Scenarios
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
