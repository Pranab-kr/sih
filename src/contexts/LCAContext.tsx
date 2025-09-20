'use client';

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { 
  LCAState, 
  LCAContextType, 
  Product, 
  Material, 
  ProcessStep, 
  LCAResults,
  MATERIAL_FACTORS,
  ENERGY_FACTORS,
  TRANSPORT_FACTORS
} from '@/types/lca';

// Initial state
const initialState: LCAState = {
  currentProduct: null,
  products: [],
  calculations: null,
  isCalculating: false,
  lastCalculated: null,
};

// Action types
type LCAAction =
  | { type: 'SET_CURRENT_PRODUCT'; payload: Product }
  | { type: 'ADD_MATERIAL'; payload: Material }
  | { type: 'UPDATE_MATERIAL'; payload: { id: string; material: Partial<Material> } }
  | { type: 'REMOVE_MATERIAL'; payload: string }
  | { type: 'ADD_PROCESS'; payload: ProcessStep }
  | { type: 'UPDATE_PROCESS'; payload: { id: string; process: Partial<ProcessStep> } }
  | { type: 'REMOVE_PROCESS'; payload: string }
  | { type: 'SET_CALCULATING'; payload: boolean }
  | { type: 'SET_CALCULATIONS'; payload: LCAResults }
  | { type: 'SAVE_PRODUCT' }
  | { type: 'LOAD_PRODUCT'; payload: string }
  | { type: 'RESET_CALCULATION' };

// Reducer
function lcaReducer(state: LCAState, action: LCAAction): LCAState {
  switch (action.type) {
    case 'SET_CURRENT_PRODUCT':
      return {
        ...state,
        currentProduct: action.payload,
      };

    case 'ADD_MATERIAL':
      if (!state.currentProduct) return state;
      return {
        ...state,
        currentProduct: {
          ...state.currentProduct,
          materials: [...state.currentProduct.materials, action.payload],
          updatedAt: new Date(),
        },
      };

    case 'UPDATE_MATERIAL':
      if (!state.currentProduct) return state;
      return {
        ...state,
        currentProduct: {
          ...state.currentProduct,
          materials: state.currentProduct.materials.map(material =>
            material.id === action.payload.id
              ? { ...material, ...action.payload.material }
              : material
          ),
          updatedAt: new Date(),
        },
      };

    case 'REMOVE_MATERIAL':
      if (!state.currentProduct) return state;
      return {
        ...state,
        currentProduct: {
          ...state.currentProduct,
          materials: state.currentProduct.materials.filter(
            material => material.id !== action.payload
          ),
          updatedAt: new Date(),
        },
      };

    case 'ADD_PROCESS':
      if (!state.currentProduct) return state;
      return {
        ...state,
        currentProduct: {
          ...state.currentProduct,
          processes: [...state.currentProduct.processes, action.payload],
          updatedAt: new Date(),
        },
      };

    case 'UPDATE_PROCESS':
      if (!state.currentProduct) return state;
      return {
        ...state,
        currentProduct: {
          ...state.currentProduct,
          processes: state.currentProduct.processes.map(process =>
            process.id === action.payload.id
              ? { ...process, ...action.payload.process }
              : process
          ),
          updatedAt: new Date(),
        },
      };

    case 'REMOVE_PROCESS':
      if (!state.currentProduct) return state;
      return {
        ...state,
        currentProduct: {
          ...state.currentProduct,
          processes: state.currentProduct.processes.filter(
            process => process.id !== action.payload
          ),
          updatedAt: new Date(),
        },
      };

    case 'SET_CALCULATING':
      return {
        ...state,
        isCalculating: action.payload,
      };

    case 'SET_CALCULATIONS':
      return {
        ...state,
        calculations: action.payload,
        isCalculating: false,
        lastCalculated: new Date(),
      };

    case 'SAVE_PRODUCT':
      if (!state.currentProduct) return state;
      const existingIndex = state.products.findIndex(p => p.id === state.currentProduct!.id);
      const updatedProducts = existingIndex >= 0
        ? state.products.map((p, i) => i === existingIndex ? state.currentProduct! : p)
        : [...state.products, state.currentProduct];
      
      // Save to localStorage
      localStorage.setItem('lca_products', JSON.stringify(updatedProducts));
      
      return {
        ...state,
        products: updatedProducts,
      };

    case 'LOAD_PRODUCT':
      const productToLoad = state.products.find(p => p.id === action.payload);
      return {
        ...state,
        currentProduct: productToLoad || null,
        calculations: null,
      };

    case 'RESET_CALCULATION':
      return {
        ...state,
        calculations: null,
        isCalculating: false,
        lastCalculated: null,
      };

    default:
      return state;
  }
}

// LCA Calculation Engine
function calculateLCA(product: Product): LCAResults {
  let totalCarbonFootprint = 0;
  let totalEnergyConsumption = 0;
  let totalWaterUsage = 0;
  let totalWasteGeneration = 0;

  const carbonFootprintByStage = {
    materials: 0,
    manufacturing: 0,
    transport: 0,
    use: 0,
    endOfLife: 0,
  };

  // Calculate materials impact
  product.materials.forEach(material => {
    const factors = MATERIAL_FACTORS[material.type];
    const factor = material.isRecycled ? factors.recycled : factors.raw;
    
    const materialCarbon = material.quantity * factor.carbon;
    const materialEnergy = material.quantity * factor.energy;
    const materialWater = material.quantity * factor.water;

    carbonFootprintByStage.materials += materialCarbon;
    totalEnergyConsumption += materialEnergy;
    totalWaterUsage += materialWater;
  });

  // Calculate processes impact
  product.processes.forEach(process => {
    const energyEmissions = process.energyConsumption * ENERGY_FACTORS[process.energyType];
    let processEmissions = energyEmissions + process.emissions;

    // Add transport emissions if applicable
    if (process.type === 'transport' && process.distance && process.transportMode) {
      const transportEmissions = process.distance * TRANSPORT_FACTORS[process.transportMode];
      processEmissions += transportEmissions;
    }

    // Categorize emissions by stage
    switch (process.type) {
      case 'manufacturing':
        carbonFootprintByStage.manufacturing += processEmissions;
        break;
      case 'transport':
        carbonFootprintByStage.transport += processEmissions;
        break;
      case 'use':
        carbonFootprintByStage.use += processEmissions;
        break;
      case 'end_of_life':
        carbonFootprintByStage.endOfLife += processEmissions;
        break;
    }

    totalEnergyConsumption += process.energyConsumption;
    totalWaterUsage += process.waterUsage;
    totalWasteGeneration += process.wasteGenerated;
  });

  // Calculate end-of-life impact
  product.endOfLifeScenarios.forEach(scenario => {
    const scenarioEmissions = scenario.emissions * (scenario.percentage / 100);
    carbonFootprintByStage.endOfLife += scenarioEmissions;
  });

  totalCarbonFootprint = Object.values(carbonFootprintByStage).reduce((sum, value) => sum + value, 0);

  // Calculate scores
  const totalMaterialWeight = product.materials.reduce((sum, m) => sum + m.quantity, 0);
  const recycledWeight = product.materials
    .filter(m => m.isRecycled)
    .reduce((sum, m) => sum + m.quantity, 0);
  
  const recyclabilityScore = totalMaterialWeight > 0 
    ? (recycledWeight / totalMaterialWeight) * 100 
    : 0;

  const avgRecyclability = product.materials.length > 0
    ? product.materials.reduce((sum, m) => sum + m.recyclability, 0) / product.materials.length * 100
    : 0;

  const materialEfficiency = (recyclabilityScore + avgRecyclability) / 2;

  // Calculate sustainability score (composite score)
  const carbonScore = Math.max(0, 100 - (totalCarbonFootprint / totalMaterialWeight * 10));
  const energyScore = Math.max(0, 100 - (totalEnergyConsumption / totalMaterialWeight * 0.1));
  const sustainabilityScore = (carbonScore + energyScore + materialEfficiency) / 3;

  // Generate recommendations
  const recommendations = generateRecommendations(product, {
    carbonFootprintByStage,
    recyclabilityScore,
    materialEfficiency,
    totalCarbonFootprint,
  });

  return {
    totalCarbonFootprint: Math.round(totalCarbonFootprint * 100) / 100,
    carbonFootprintByStage: {
      materials: Math.round(carbonFootprintByStage.materials * 100) / 100,
      manufacturing: Math.round(carbonFootprintByStage.manufacturing * 100) / 100,
      transport: Math.round(carbonFootprintByStage.transport * 100) / 100,
      use: Math.round(carbonFootprintByStage.use * 100) / 100,
      endOfLife: Math.round(carbonFootprintByStage.endOfLife * 100) / 100,
    },
    energyConsumption: Math.round(totalEnergyConsumption * 100) / 100,
    waterUsage: Math.round(totalWaterUsage * 100) / 100,
    wasteGeneration: Math.round(totalWasteGeneration * 100) / 100,
    recyclabilityScore: Math.round(recyclabilityScore * 100) / 100,
    sustainabilityScore: Math.round(sustainabilityScore * 100) / 100,
    materialEfficiency: Math.round(materialEfficiency * 100) / 100,
    recommendations,
  };
}

function generateRecommendations(product: Product, metrics: any): string[] {
  const recommendations: string[] = [];

  // Material recommendations
  const nonRecycledMaterials = product.materials.filter(m => !m.isRecycled);
  if (nonRecycledMaterials.length > 0) {
    recommendations.push(`Consider using recycled ${nonRecycledMaterials[0].type} to reduce carbon footprint by up to 60%`);
  }

  // Energy recommendations
  const fossilProcesses = product.processes.filter(p => p.energyType === 'fossil');
  if (fossilProcesses.length > 0) {
    recommendations.push('Switch to renewable energy sources to reduce emissions by up to 90%');
  }

  // Transport recommendations
  const airTransport = product.processes.filter(p => p.transportMode === 'air');
  if (airTransport.length > 0) {
    recommendations.push('Consider alternative transport modes (ship/train) to reduce transport emissions');
  }

  // End-of-life recommendations
  const landfillScenarios = product.endOfLifeScenarios.filter(s => s.type === 'landfill');
  if (landfillScenarios.length > 0 && landfillScenarios[0].percentage > 20) {
    recommendations.push('Improve product design for better recyclability to reduce landfill waste');
  }

  // Score-based recommendations
  if (metrics.materialEfficiency < 50) {
    recommendations.push('Focus on design for disassembly and material selection for better recyclability');
  }

  if (metrics.recyclabilityScore < 30) {
    recommendations.push('Increase use of recycled materials in product composition');
  }

  return recommendations.slice(0, 5); // Return top 5 recommendations
}

// Create context
const LCAContext = createContext<LCAContextType | null>(null);

// Provider component
export function LCAProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(lcaReducer, initialState);

  // Load products from localStorage on initialization
  React.useEffect(() => {
    const savedProducts = localStorage.getItem('lca_products');
    if (savedProducts) {
      try {
        const products = JSON.parse(savedProducts);
        products.forEach((product: Product) => {
          dispatch({ type: 'SET_CURRENT_PRODUCT', payload: product });
          dispatch({ type: 'SAVE_PRODUCT' });
        });
      } catch (error) {
        console.error('Error loading saved products:', error);
      }
    }
  }, []);

  const actions = {
    setCurrentProduct: useCallback((product: Product) => {
      dispatch({ type: 'SET_CURRENT_PRODUCT', payload: product });
    }, []),

    addMaterial: useCallback((material: Material) => {
      dispatch({ type: 'ADD_MATERIAL', payload: material });
    }, []),

    updateMaterial: useCallback((id: string, material: Partial<Material>) => {
      dispatch({ type: 'UPDATE_MATERIAL', payload: { id, material } });
    }, []),

    removeMaterial: useCallback((id: string) => {
      dispatch({ type: 'REMOVE_MATERIAL', payload: id });
    }, []),

    addProcess: useCallback((process: ProcessStep) => {
      dispatch({ type: 'ADD_PROCESS', payload: process });
    }, []),

    updateProcess: useCallback((id: string, process: Partial<ProcessStep>) => {
      dispatch({ type: 'UPDATE_PROCESS', payload: { id, process } });
    }, []),

    removeProcess: useCallback((id: string) => {
      dispatch({ type: 'REMOVE_PROCESS', payload: id });
    }, []),

    calculateLCA: useCallback(async (): Promise<LCAResults> => {
      if (!state.currentProduct) {
        throw new Error('No product selected for calculation');
      }

      dispatch({ type: 'SET_CALCULATING', payload: true });

      // Simulate calculation delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const results = calculateLCA(state.currentProduct);
      dispatch({ type: 'SET_CALCULATIONS', payload: results });

      return results;
    }, [state.currentProduct]),

    saveProduct: useCallback(() => {
      dispatch({ type: 'SAVE_PRODUCT' });
    }, []),

    loadProduct: useCallback((id: string) => {
      dispatch({ type: 'LOAD_PRODUCT', payload: id });
    }, []),

    resetCalculation: useCallback(() => {
      dispatch({ type: 'RESET_CALCULATION' });
    }, []),
  };

  return (
    <LCAContext.Provider value={{ state, actions }}>
      {children}
    </LCAContext.Provider>
  );
}

// Hook to use LCA context
export function useLCA() {
  const context = useContext(LCAContext);
  if (!context) {
    throw new Error('useLCA must be used within an LCAProvider');
  }
  return context;
}