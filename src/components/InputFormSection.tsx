'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Calculator, Leaf } from 'lucide-react';
import { useLCA } from '@/contexts/LCAContext';
import { Product } from '@/types/lca';

// Material emission factors (kg CO2 eq per unit)
const MATERIAL_FACTORS = {
  aluminum: { co2: 8.24, water: 15.2, land: 0.003 },
  steel: { co2: 2.29, water: 5.4, land: 0.002 },
  plastic: { co2: 3.4, water: 2.1, land: 0.001 },
  glass: { co2: 0.85, water: 0.8, land: 0.001 },
  paper: { co2: 1.06, water: 20.3, land: 0.02 },
  wood: { co2: 0.42, water: 1.2, land: 0.05 },
  concrete: { co2: 0.13, water: 1.0, land: 0.001 },
  other: { co2: 2.0, water: 3.0, land: 0.002 }
};

// Move InputRow component outside to prevent recreation
const InputRow = ({ label, value, onChange, unit, placeholder = "0.00" }: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit: string;
  placeholder?: string;
}) => (
  <div className="flex items-center p-4 bg-neutral-50 rounded-lg border-2 border-transparent hover:border-blue-200 hover:bg-blue-50 transition-all duration-200">
    <div className="flex-1 font-medium text-neutral-700">{label}</div>
    <Input
      type="number"
      value={value === 0 ? '' : value.toString()}
      onChange={(e) => {
        const inputValue = e.target.value;
        if (inputValue === '' || inputValue === '.') {
          onChange(0);
        } else {
          const numValue = parseFloat(inputValue);
          if (!isNaN(numValue)) {
            onChange(numValue);
          }
        }
      }}
      placeholder={placeholder}
      step="0.01"
      min="0"
      className="w-32 text-center mx-3"
    />
    <div className="w-16 text-neutral-500 text-sm">{unit}</div>
  </div>
);

export function InputFormSection() {
  const { state, actions } = useLCA();
  
  // Material selection
  const [selectedMaterial, setSelectedMaterial] = useState<keyof typeof MATERIAL_FACTORS>('aluminum');

  // Production Parameters
  const [productionInputs, setProductionInputs] = useState({
    rawMaterial: 0,
    electricity: 0,
    naturalGas: 0,
    water: 0,
  });

  // Chemical Inputs
  const [chemicalInputs, setChemicalInputs] = useState({
    sulfuricAcid: 0,
    causticSoda: 0,
    lubricants: 0,
  });

  // Waste & Transport
  const [wasteTransport, setWasteTransport] = useState({
    wasteWater: 0,
    solidWaste: 0,
    transportDistance: 0,
  });



  // Calculate realistic environmental impacts based on input data
  const calculateImpacts = () => {
    const materialFactor = MATERIAL_FACTORS[selectedMaterial];
    
    // Calculate individual impact components
    const electricityImpact = productionInputs.electricity * 0.3; // Grid emission factor
    const materialImpact = productionInputs.rawMaterial * materialFactor.co2;
    const naturalGasImpact = productionInputs.naturalGas * 1.9;
    const transportImpact = wasteTransport.transportDistance * 0.003;
    const chemicalImpact = (chemicalInputs.sulfuricAcid * 0.15) + 
                          (chemicalInputs.causticSoda * 0.12) + 
                          (chemicalInputs.lubricants * 0.08);
    const wasteImpact = wasteTransport.wasteWater * 0.17;
    
    const totalCO2 = electricityImpact + materialImpact + naturalGasImpact + 
                     transportImpact + chemicalImpact + wasteImpact;
    
    const totalWater = productionInputs.water + 
                       (productionInputs.rawMaterial * materialFactor.water) + 
                       (wasteTransport.wasteWater * 1.2);
    
    const energyIntensity = productionInputs.rawMaterial > 0 ? 
                           (productionInputs.electricity / productionInputs.rawMaterial) : 0;
    
    const waterFootprint = productionInputs.rawMaterial > 0 ? 
                          (totalWater / productionInputs.rawMaterial) : 0;

    return {
      totalCO2,
      totalWater,
      energyIntensity,
      waterFootprint,
      primaryMaterial: productionInputs.rawMaterial
    };
  };

  // Setup product with current inputs
  const setupProduct = () => {
    const materialFactor = MATERIAL_FACTORS[selectedMaterial];
    const impacts = calculateImpacts();

    // Create a product based on current inputs
    const newProduct: Product = {
      id: `product_${Date.now()}`,
      name: `${selectedMaterial.charAt(0).toUpperCase() + selectedMaterial.slice(1)} Product`,
      description: `Product made from ${selectedMaterial}`,
      functionalUnit: `${productionInputs.rawMaterial} kg`,
      lifespan: 10,
      materials: [{
        id: `material_${Date.now()}`,
        name: selectedMaterial,
        quantity: productionInputs.rawMaterial,
        unit: 'kg',
        type: selectedMaterial,
        isRecycled: false,
        recyclability: 0.8,
        carbonIntensity: materialFactor.co2,
        energyIntensity: materialFactor.co2 * 2.5,
        waterIntensity: materialFactor.water,
      }],
      processes: [{
        id: `process_${Date.now()}`,
        name: 'Manufacturing Process',
        type: 'manufacturing',
        energyConsumption: productionInputs.electricity,
        energyType: 'grid',
        emissions: impacts.totalCO2,
        waterUsage: impacts.totalWater,
        wasteGenerated: wasteTransport.solidWaste,
        duration: 1,
      }],
      endOfLifeScenarios: [
        { id: '1', name: 'Recycling', percentage: 65, type: 'recycle', emissions: 0.1 },
        { id: '2', name: 'Landfill', percentage: 20, type: 'landfill', emissions: 0.8 },
        { id: '3', name: 'Incineration', percentage: 15, type: 'incineration', emissions: 0.6 },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    actions.setCurrentProduct(newProduct);
    return newProduct;
  };

  const handleCalculate = async () => {
    try {
      const product = setupProduct();
      // Pass the product directly to calculateLCA to avoid state race condition
      await actions.calculateLCA(product);
    } catch (error) {
      console.error('Error calculating LCA:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-600" />
            LCA Input Parameters
            {state.calculations && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                Calculated
              </Badge>
            )}
          </CardTitle>
          <CardDescription className="text-neutral-600">
            Enter your production parameters to calculate environmental impact
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Material Selection */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold">Material Selection</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.keys(MATERIAL_FACTORS).map((material) => (
                <Button
                  key={material}
                  variant={selectedMaterial === material ? "default" : "outline"}
                  onClick={() => setSelectedMaterial(material as keyof typeof MATERIAL_FACTORS)}
                  className={`${
                    selectedMaterial === material 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'hover:bg-blue-50 hover:border-blue-300'
                  }`}
                >
                  {material.charAt(0).toUpperCase() + material.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Production Parameters */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Production Parameters</Label>
            <div className="space-y-3">
              <InputRow
                label="Raw Material Mass"
                value={productionInputs.rawMaterial}
                onChange={(value) => setProductionInputs(prev => ({ ...prev, rawMaterial: value }))}
                unit="kg"
              />
              <InputRow
                label="Electricity Consumption"
                value={productionInputs.electricity}
                onChange={(value) => setProductionInputs(prev => ({ ...prev, electricity: value }))}
                unit="kWh"
              />
              <InputRow
                label="Natural Gas"
                value={productionInputs.naturalGas}
                onChange={(value) => setProductionInputs(prev => ({ ...prev, naturalGas: value }))}
                unit="m³"
              />
              <InputRow
                label="Water Usage"
                value={productionInputs.water}
                onChange={(value) => setProductionInputs(prev => ({ ...prev, water: value }))}
                unit="liter"
              />
            </div>
          </div>

          {/* Chemical Inputs */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Chemical Inputs</Label>
            <div className="space-y-3">
              <InputRow
                label="Sulfuric Acid"
                value={chemicalInputs.sulfuricAcid}
                onChange={(value) => setChemicalInputs(prev => ({ ...prev, sulfuricAcid: value }))}
                unit="kg"
              />
              <InputRow
                label="Caustic Soda"
                value={chemicalInputs.causticSoda}
                onChange={(value) => setChemicalInputs(prev => ({ ...prev, causticSoda: value }))}
                unit="kg"
              />
              <InputRow
                label="Lubricants"
                value={chemicalInputs.lubricants}
                onChange={(value) => setChemicalInputs(prev => ({ ...prev, lubricants: value }))}
                unit="kg"
              />
            </div>
          </div>

          {/* Waste & Transport */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Waste & Transport</Label>
            <div className="space-y-3">
              <InputRow
                label="Waste Water"
                value={wasteTransport.wasteWater}
                onChange={(value) => setWasteTransport(prev => ({ ...prev, wasteWater: value }))}
                unit="m³"
              />
              <InputRow
                label="Solid Waste"
                value={wasteTransport.solidWaste}
                onChange={(value) => setWasteTransport(prev => ({ ...prev, solidWaste: value }))}
                unit="kg"
              />
              <InputRow
                label="Transport Distance"
                value={wasteTransport.transportDistance}
                onChange={(value) => setWasteTransport(prev => ({ ...prev, transportDistance: value }))}
                unit="km"
              />
            </div>
          </div>

          {/* Calculate Button */}
          <div className="flex justify-center pt-6">
            <Button 
              onClick={handleCalculate} 
              disabled={state.isCalculating || productionInputs.rawMaterial === 0}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 px-8"
            >
              {state.isCalculating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="h-5 w-5 mr-2" />
                  Calculate LCA
                </>
              )}
            </Button>
          </div>

          {productionInputs.rawMaterial === 0 && (
            <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg text-center">
              Please enter raw material mass to begin calculation
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}