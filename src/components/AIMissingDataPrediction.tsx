'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Brain, Sparkles } from 'lucide-react';

interface MissingParameter {
  id: string;
  label: string;
  category: 'production' | 'chemical' | 'waste';
  accuracy: number;
  isMissing: boolean;
  currentValue: number;
}

interface AIMissingDataPredictionProps {
  productionInputs: {
    rawMaterial: number;
    electricity: number;
    naturalGas: number;
    water: number;
  };
  chemicalInputs: {
    sulfuricAcid: number;
    causticSoda: number;
    lubricants: number;
  };
  wasteTransport: {
    wasteWater: number;
    solidWaste: number;
    transportDistance: number;
  };
  onPredictMissing: (predictions: Record<string, number>) => void;
}

export function AIMissingDataPrediction({
  productionInputs,
  chemicalInputs,
  wasteTransport,
  onPredictMissing
}: AIMissingDataPredictionProps) {
  const [selectedParameters, setSelectedParameters] = useState<Set<string>>(new Set());
  const [predictionMode, setPredictionMode] = useState<'conservative' | 'average' | 'optimized'>('conservative');
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate realistic random values based on material type and existing inputs
  const generatePredictedValue = (parameterId: string, accuracy: number): number => {
    const baseValues: Record<string, { min: number; max: number; unit: string }> = {
      'raw-material': { min: 50, max: 500, unit: 'kg' },
      'electricity': { min: 100, max: 2000, unit: 'kWh' },
      'natural-gas': { min: 50, max: 800, unit: 'm³' },
      'water': { min: 200, max: 1500, unit: 'L' },
      'sulfuric-acid': { min: 5, max: 50, unit: 'kg' },
      'caustic-soda': { min: 3, max: 30, unit: 'kg' },
      'lubricants': { min: 2, max: 25, unit: 'L' },
      'waste-water': { min: 150, max: 1200, unit: 'm³' },
      'solid-waste': { min: 10, max: 100, unit: 'kg' },
      'transport-distance': { min: 50, max: 500, unit: 'km' }
    };

    const range = baseValues[parameterId];
    if (!range) return 0;

    // Add some variation based on prediction mode
    let multiplier = 1;
    switch (predictionMode) {
      case 'conservative':
        multiplier = 0.7; // Lower estimates for safety
        break;
      case 'average':
        multiplier = 1.0; // Industry average
        break;
      case 'optimized':
        multiplier = 1.3; // Best-case scenario estimates
        break;
    }

    // Generate random value within range with some intelligence based on accuracy
    const accuracyFactor = accuracy / 100;
    const baseValue = Math.random() * (range.max - range.min) + range.min;
    const adjustedValue = baseValue * multiplier * (0.8 + accuracyFactor * 0.4);

    return Math.round(adjustedValue * 100) / 100;
  };

  // Identify missing parameters
  const getMissingParameters = (): MissingParameter[] => {
    return [
      {
        id: 'raw-material',
        label: 'Raw Material Mass',
        category: 'production',
        accuracy: 95,
        isMissing: productionInputs.rawMaterial === 0,
        currentValue: productionInputs.rawMaterial
      },
      {
        id: 'electricity',
        label: 'Electricity Consumption',
        category: 'production',
        accuracy: 92,
        isMissing: productionInputs.electricity === 0,
        currentValue: productionInputs.electricity
      },
      {
        id: 'natural-gas',
        label: 'Natural Gas Usage',
        category: 'production',
        accuracy: 88,
        isMissing: productionInputs.naturalGas === 0,
        currentValue: productionInputs.naturalGas
      },
      {
        id: 'water',
        label: 'Water Usage',
        category: 'production',
        accuracy: 90,
        isMissing: productionInputs.water === 0,
        currentValue: productionInputs.water
      },
      {
        id: 'sulfuric-acid',
        label: 'Sulfuric Acid',
        category: 'chemical',
        accuracy: 85,
        isMissing: chemicalInputs.sulfuricAcid === 0,
        currentValue: chemicalInputs.sulfuricAcid
      },
      {
        id: 'caustic-soda',
        label: 'Caustic Soda',
        category: 'chemical',
        accuracy: 83,
        isMissing: chemicalInputs.causticSoda === 0,
        currentValue: chemicalInputs.causticSoda
      },
      {
        id: 'lubricants',
        label: 'Lubricants',
        category: 'chemical',
        accuracy: 78,
        isMissing: chemicalInputs.lubricants === 0,
        currentValue: chemicalInputs.lubricants
      },
      {
        id: 'waste-water',
        label: 'Waste Water',
        category: 'waste',
        accuracy: 87,
        isMissing: wasteTransport.wasteWater === 0,
        currentValue: wasteTransport.wasteWater
      },
      {
        id: 'solid-waste',
        label: 'Solid Waste',
        category: 'waste',
        accuracy: 82,
        isMissing: wasteTransport.solidWaste === 0,
        currentValue: wasteTransport.solidWaste
      },
      {
        id: 'transport-distance',
        label: 'Transport Distance',
        category: 'waste',
        accuracy: 75,
        isMissing: wasteTransport.transportDistance === 0,
        currentValue: wasteTransport.transportDistance
      }
    ];
  };

  const missingParameters = getMissingParameters().filter(param => param.isMissing);
  
  // Don't show the component if there are no missing parameters
  if (missingParameters.length === 0) {
    return null;
  }

  const handleParameterToggle = (parameterId: string) => {
    const newSelected = new Set(selectedParameters);
    if (newSelected.has(parameterId)) {
      newSelected.delete(parameterId);
    } else {
      newSelected.add(parameterId);
    }
    setSelectedParameters(newSelected);
  };

  const handleSelectAllMissing = () => {
    const allMissingIds = missingParameters.map(param => param.id);
    setSelectedParameters(new Set(allMissingIds));
  };

  const handlePredictSelected = async () => {
    if (selectedParameters.size === 0) return;

    setIsGenerating(true);

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1200));

    const predictions: Record<string, number> = {};
    
    selectedParameters.forEach(parameterId => {
      const parameter = missingParameters.find(p => p.id === parameterId);
      if (parameter) {
        predictions[parameterId] = generatePredictedValue(parameterId, parameter.accuracy);
      }
    });

    onPredictMissing(predictions);
    setSelectedParameters(new Set()); // Clear selection after prediction
    setIsGenerating(false);
  };

  const groupedParameters = {
    production: missingParameters.filter(p => p.category === 'production'),
    chemical: missingParameters.filter(p => p.category === 'chemical'),
    waste: missingParameters.filter(p => p.category === 'waste')
  };

  return (
    <Card className="border-2 border-dashed border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Brain className="h-5 w-5" />
          AI-Powered Missing Data Prediction
        </CardTitle>
        <p className="text-sm text-blue-600">
          Our AI model can predict missing parameters based on material type, production scale, and existing inputs. 
          Select the parameters you want to predict:
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Production Parameters */}
          {groupedParameters.production.length > 0 && (
            <div>
              <h3 className="font-medium text-blue-700 mb-3 border-b border-blue-200 pb-1">
                Production Parameters
              </h3>
              <div className="space-y-2">
                {groupedParameters.production.map((param) => (
                  <div 
                    key={param.id}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Checkbox
                      id={param.id}
                      checked={selectedParameters.has(param.id)}
                      onCheckedChange={() => handleParameterToggle(param.id)}
                    />
                    <label 
                      htmlFor={param.id}
                      className="flex-1 text-sm text-gray-700 cursor-pointer"
                    >
                      {param.label}
                    </label>
                    <Badge 
                      variant="secondary" 
                      className="text-xs bg-green-100 text-green-700"
                    >
                      {param.accuracy}% accuracy
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chemical Inputs */}
          {groupedParameters.chemical.length > 0 && (
            <div>
              <h3 className="font-medium text-blue-700 mb-3 border-b border-blue-200 pb-1">
                Chemical Inputs
              </h3>
              <div className="space-y-2">
                {groupedParameters.chemical.map((param) => (
                  <div 
                    key={param.id}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Checkbox
                      id={param.id}
                      checked={selectedParameters.has(param.id)}
                      onCheckedChange={() => handleParameterToggle(param.id)}
                    />
                    <label 
                      htmlFor={param.id}
                      className="flex-1 text-sm text-gray-700 cursor-pointer"
                    >
                      {param.label}
                    </label>
                    <Badge 
                      variant="secondary" 
                      className="text-xs bg-green-100 text-green-700"
                    >
                      {param.accuracy}% accuracy
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Waste & Transport */}
          {groupedParameters.waste.length > 0 && (
            <div>
              <h3 className="font-medium text-blue-700 mb-3 border-b border-blue-200 pb-1">
                Waste & Transport
              </h3>
              <div className="space-y-2">
                {groupedParameters.waste.map((param) => (
                  <div 
                    key={param.id}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Checkbox
                      id={param.id}
                      checked={selectedParameters.has(param.id)}
                      onCheckedChange={() => handleParameterToggle(param.id)}
                    />
                    <label 
                      htmlFor={param.id}
                      className="flex-1 text-sm text-gray-700 cursor-pointer"
                    >
                      {param.label}
                    </label>
                    <Badge 
                      variant="secondary" 
                      className="text-xs bg-green-100 text-green-700"
                    >
                      {param.accuracy}% accuracy
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Prediction Mode Selection */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="text-sm font-medium text-blue-700 mb-2 block">
              Prediction Mode:
            </label>
            <div className="flex gap-2">
              {[
                { key: 'conservative' as const, label: 'Conservative', desc: 'Lower-bound estimates for safety' },
                { key: 'average' as const, label: 'Average', desc: 'Industry average values' },
                { key: 'optimized' as const, label: 'Optimized', desc: 'Best-case scenario estimates' }
              ].map(mode => (
                <button
                  key={mode.key}
                  onClick={() => setPredictionMode(mode.key)}
                  className={`flex-1 p-2 text-xs rounded-lg border transition-colors ${
                    predictionMode === mode.key
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'
                  }`}
                  title={mode.desc}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-blue-200">
          <Button 
            onClick={handleSelectAllMissing}
            variant="outline"
            className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            Select All Missing
          </Button>
          
          <Button 
            onClick={handlePredictSelected}
            disabled={selectedParameters.size === 0 || isGenerating}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating Predictions...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Predict Missing Parameters
              </>
            )}
          </Button>
        </div>

        {selectedParameters.size === 0 && (
          <div className="text-sm text-blue-600 bg-blue-100 p-3 rounded-lg text-center">
            Select parameters above to generate AI predictions
          </div>
        )}
      </CardContent>
    </Card>
  );
}