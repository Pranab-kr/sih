'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Trash2, Plus, Calculator, Save, AlertCircle } from 'lucide-react';
import { useLCA } from '@/contexts/LCAContext';
import { Material, ProcessStep, Product, MaterialFormData, ProcessFormData, MATERIAL_FACTORS } from '@/types/lca';

export function InputFormSection() {
  const { state, actions } = useLCA();
  
  // Form states
  const [materialForm, setMaterialForm] = useState<MaterialFormData>({
    name: '',
    quantity: 0,
    unit: 'kg',
    type: 'aluminum',
    isRecycled: false,
  });

  const [processForm, setProcessForm] = useState<ProcessFormData>({
    name: '',
    type: 'manufacturing',
    energyConsumption: 0,
    energyType: 'grid',
    duration: 0,
  });

  // Initialize product if none exists
  useEffect(() => {
    if (!state.currentProduct) {
      const newProduct: Product = {
        id: `product_${Date.now()}`,
        name: 'New Product',
        description: '',
        functionalUnit: '1 unit',
        lifespan: 1,
        materials: [],
        processes: [],
        endOfLifeScenarios: [
          { id: '1', name: 'Recycling', percentage: 70, type: 'recycle', emissions: 0.1 },
          { id: '2', name: 'Landfill', percentage: 30, type: 'landfill', emissions: 0.5 },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      actions.setCurrentProduct(newProduct);
    }
  }, [state.currentProduct, actions]);

  // Update product info
  const handleProductInfoChange = (field: string, value: string | number) => {
    if (state.currentProduct) {
      const updatedProduct = {
        ...state.currentProduct,
        [field]: value,
        updatedAt: new Date(),
      };
      actions.setCurrentProduct(updatedProduct);
    }
  };

  // Add material
  const handleAddMaterial = () => {
    if (!materialForm.name || materialForm.quantity <= 0) return;

    const factors = MATERIAL_FACTORS[materialForm.type];
    const factor = materialForm.isRecycled ? factors.recycled : factors.raw;

    const newMaterial: Material = {
      id: `material_${Date.now()}`,
      name: materialForm.name,
      quantity: materialForm.quantity,
      unit: materialForm.unit,
      type: materialForm.type,
      isRecycled: materialForm.isRecycled,
      recyclability: materialForm.type === 'aluminum' ? 0.95 : 
                    materialForm.type === 'steel' ? 0.90 :
                    materialForm.type === 'glass' ? 0.85 :
                    materialForm.type === 'paper' ? 0.80 : 0.70,
      carbonIntensity: factor.carbon,
      energyIntensity: factor.energy,
      waterIntensity: factor.water,
    };

    actions.addMaterial(newMaterial);
    
    // Reset form
    setMaterialForm({
      name: '',
      quantity: 0,
      unit: 'kg',
      type: 'aluminum',
      isRecycled: false,
    });
  };

  // Add process
  const handleAddProcess = () => {
    if (!processForm.name || processForm.energyConsumption < 0) return;

    const newProcess: ProcessStep = {
      id: `process_${Date.now()}`,
      name: processForm.name,
      type: processForm.type,
      energyConsumption: processForm.energyConsumption,
      energyType: processForm.energyType,
      emissions: processForm.energyConsumption * 0.1, // Base emissions
      waterUsage: processForm.energyConsumption * 2, // Estimated water usage
      wasteGenerated: processForm.energyConsumption * 0.05, // Estimated waste
      duration: processForm.duration,
      distance: processForm.distance,
      transportMode: processForm.transportMode,
    };

    actions.addProcess(newProcess);
    
    // Reset form
    setProcessForm({
      name: '',
      type: 'manufacturing',
      energyConsumption: 0,
      energyType: 'grid',
      duration: 0,
    });
  };

  // Calculate LCA
  const handleCalculate = async () => {
    try {
      await actions.calculateLCA();
    } catch (error) {
      console.error('Calculation error:', error);
    }
  };

  // Save product
  const handleSave = () => {
    actions.saveProduct();
  };

  if (!state.currentProduct) return null;

  return (
    <Card className="bg-neutral-50 border-neutral-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-neutral-800 flex items-center gap-2">
          Impact Assessment Parameters
          {state.calculations && (
            <Badge variant="outline" className="text-green-600 border-green-600">
              Calculated
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="text-neutral-600">
          Configure your product materials and processes to calculate environmental impact
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="product" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="product">Product Info</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="processes">Processes</TabsTrigger>
            <TabsTrigger value="calculate">Calculate</TabsTrigger>
          </TabsList>

          <TabsContent value="product" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Product Name</Label>
                <Input
                  value={state.currentProduct.name}
                  onChange={(e) => handleProductInfoChange('name', e.target.value)}
                  placeholder="Enter product name"
                />
              </div>
              <div className="space-y-2">
                <Label>Functional Unit</Label>
                <Input
                  value={state.currentProduct.functionalUnit}
                  onChange={(e) => handleProductInfoChange('functionalUnit', e.target.value)}
                  placeholder="e.g., 1 unit, 1 kg"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={state.currentProduct.description}
                  onChange={(e) => handleProductInfoChange('description', e.target.value)}
                  placeholder="Product description"
                />
              </div>
              <div className="space-y-2">
                <Label>Lifespan (years)</Label>
                <Input
                  type="number"
                  value={state.currentProduct.lifespan}
                  onChange={(e) => handleProductInfoChange('lifespan', parseInt(e.target.value) || 1)}
                  min="1"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="materials" className="space-y-6">
            {/* Add Material Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add Material</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Material Name</Label>
                    <Input
                      value={materialForm.name}
                      onChange={(e) => setMaterialForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter material name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={materialForm.quantity}
                      onChange={(e) => setMaterialForm(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
                      min="0"
                      step="0.1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Unit</Label>
                    <Select value={materialForm.unit} onValueChange={(value: string) => setMaterialForm(prev => ({ ...prev, unit: value as 'kg' | 'ton' | 'pieces' | 'liters' | 'm3' }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="ton">ton</SelectItem>
                        <SelectItem value="pieces">pieces</SelectItem>
                        <SelectItem value="liters">liters</SelectItem>
                        <SelectItem value="m3">m³</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Material Type</Label>
                    <Select value={materialForm.type} onValueChange={(value: string) => setMaterialForm(prev => ({ ...prev, type: value as 'aluminum' | 'steel' | 'plastic' | 'glass' | 'paper' | 'wood' | 'concrete' | 'other' }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aluminum">Aluminum</SelectItem>
                        <SelectItem value="steel">Steel</SelectItem>
                        <SelectItem value="plastic">Plastic</SelectItem>
                        <SelectItem value="glass">Glass</SelectItem>
                        <SelectItem value="paper">Paper</SelectItem>
                        <SelectItem value="wood">Wood</SelectItem>
                        <SelectItem value="concrete">Concrete</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={materialForm.isRecycled}
                      onCheckedChange={(checked) => setMaterialForm(prev => ({ ...prev, isRecycled: checked }))}
                    />
                    <Label>Recycled Content</Label>
                  </div>
                  <Button onClick={handleAddMaterial} disabled={!materialForm.name || materialForm.quantity <= 0}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Material
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Materials List */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Added Materials ({state.currentProduct.materials.length})</h3>
              {state.currentProduct.materials.length === 0 ? (
                <div className="text-center py-8 text-neutral-500">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  No materials added yet
                </div>
              ) : (
                state.currentProduct.materials.map((material) => (
                  <Card key={material.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <h4 className="font-medium">{material.name}</h4>
                          <p className="text-sm text-neutral-600">
                            {material.quantity} {material.unit} • {material.type}
                            {material.isRecycled && <Badge className="ml-2 bg-green-100 text-green-800">Recycled</Badge>}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => actions.removeMaterial(material.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="processes" className="space-y-6">
            {/* Add Process Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add Process</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Process Name</Label>
                    <Input
                      value={processForm.name}
                      onChange={(e) => setProcessForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter process name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Process Type</Label>
                    <Select value={processForm.type} onValueChange={(value: string) => setProcessForm(prev => ({ ...prev, type: value as 'manufacturing' | 'transport' | 'use' | 'end_of_life' }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="transport">Transport</SelectItem>
                        <SelectItem value="use">Use Phase</SelectItem>
                        <SelectItem value="end_of_life">End of Life</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Energy Consumption (kWh)</Label>
                    <Input
                      type="number"
                      value={processForm.energyConsumption}
                      onChange={(e) => setProcessForm(prev => ({ ...prev, energyConsumption: parseFloat(e.target.value) || 0 }))}
                      min="0"
                      step="0.1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Energy Type</Label>
                    <Select value={processForm.energyType} onValueChange={(value: string) => setProcessForm(prev => ({ ...prev, energyType: value as 'grid' | 'renewable' | 'fossil' }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grid">Grid Electricity</SelectItem>
                        <SelectItem value="renewable">Renewable</SelectItem>
                        <SelectItem value="fossil">Fossil Fuel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Duration (hours)</Label>
                    <Input
                      type="number"
                      value={processForm.duration}
                      onChange={(e) => setProcessForm(prev => ({ ...prev, duration: parseFloat(e.target.value) || 0 }))}
                      min="0"
                      step="0.1"
                    />
                  </div>
                  {processForm.type === 'transport' && (
                    <>
                      <div className="space-y-2">
                        <Label>Distance (km)</Label>
                        <Input
                          type="number"
                          value={processForm.distance || 0}
                          onChange={(e) => setProcessForm(prev => ({ ...prev, distance: parseFloat(e.target.value) || 0 }))}
                          min="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Transport Mode</Label>
                        <Select value={processForm.transportMode || 'truck'} onValueChange={(value: string) => setProcessForm(prev => ({ ...prev, transportMode: value as 'truck' | 'ship' | 'train' | 'air' }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="truck">Truck</SelectItem>
                            <SelectItem value="ship">Ship</SelectItem>
                            <SelectItem value="train">Train</SelectItem>
                            <SelectItem value="air">Air</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleAddProcess} disabled={!processForm.name}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Process
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Processes List */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Added Processes ({state.currentProduct.processes.length})</h3>
              {state.currentProduct.processes.length === 0 ? (
                <div className="text-center py-8 text-neutral-500">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  No processes added yet
                </div>
              ) : (
                state.currentProduct.processes.map((process) => (
                  <Card key={process.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{process.name}</h4>
                        <p className="text-sm text-neutral-600">
                          {process.type} • {process.energyConsumption} kWh ({process.energyType})
                          {process.distance && ` • ${process.distance} km`}
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => actions.removeProcess(process.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="calculate" className="space-y-6">
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Ready to Calculate</h3>
                <p className="text-neutral-600">
                  Calculate the environmental impact of your product based on the materials and processes you&apos;ve defined.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{state.currentProduct.materials.length}</div>
                  <div className="text-sm text-blue-800">Materials</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{state.currentProduct.processes.length}</div>
                  <div className="text-sm text-green-800">Processes</div>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <Button onClick={handleSave} variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  Save Product
                </Button>
                <Button 
                  onClick={handleCalculate} 
                  disabled={state.isCalculating || state.currentProduct.materials.length === 0}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {state.isCalculating ? (
                    <>Calculating...</>
                  ) : (
                    <>
                      <Calculator className="h-4 w-4 mr-2" />
                      Calculate LCA
                    </>
                  )}
                </Button>
              </div>

              {state.currentProduct.materials.length === 0 && (
                <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                  Please add at least one material before calculating
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}