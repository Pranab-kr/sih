// Core LCA Data Types

export interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: 'kg' | 'ton' | 'pieces' | 'liters' | 'm3';
  type: 'aluminum' | 'steel' | 'plastic' | 'glass' | 'paper' | 'wood' | 'concrete' | 'other';
  isRecycled: boolean;
  recyclability: number; // 0-1 (0% to 100%)
  carbonIntensity: number; // kg CO2e per unit
  energyIntensity: number; // MJ per unit
  waterIntensity: number; // liters per unit
}

export interface ProcessStep {
  id: string;
  name: string;
  type: 'manufacturing' | 'transport' | 'use' | 'end_of_life';
  energyConsumption: number; // kWh
  energyType: 'grid' | 'renewable' | 'fossil';
  emissions: number; // kg CO2e
  waterUsage: number; // liters
  wasteGenerated: number; // kg
  duration: number; // hours or days
  distance?: number; // km (for transport)
  transportMode?: 'truck' | 'ship' | 'train' | 'air';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  functionalUnit: string; // e.g., "1 unit", "1 kg", "1 m2"
  lifespan: number; // years
  materials: Material[];
  processes: ProcessStep[];
  endOfLifeScenarios: EndOfLifeScenario[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EndOfLifeScenario {
  id: string;
  name: string;
  percentage: number; // 0-100
  type: 'recycle' | 'reuse' | 'energy_recovery' | 'landfill' | 'incineration';
  emissions: number; // kg CO2e
  energyRecovery?: number; // kWh
  materialRecovery?: number; // kg
}

// Calculation Results
export interface LCAResults {
  totalCarbonFootprint: number; // kg CO2e
  carbonFootprintByStage: {
    materials: number;
    manufacturing: number;
    transport: number;
    use: number;
    endOfLife: number;
  };
  energyConsumption: number; // kWh
  waterUsage: number; // liters
  wasteGeneration: number; // kg
  recyclabilityScore: number; // 0-100
  sustainabilityScore: number; // 0-100
  materialEfficiency: number; // 0-100
  recommendations: string[];
}

// Application State Types
export interface LCAState {
  currentProduct: Product | null;
  products: Product[];
  calculations: LCAResults | null;
  isCalculating: boolean;
  lastCalculated: Date | null;
}

export interface LCAContextType {
  state: LCAState;
  actions: {
    setCurrentProduct: (product: Product) => void;
    addMaterial: (material: Material) => void;
    updateMaterial: (id: string, material: Partial<Material>) => void;
    removeMaterial: (id: string) => void;
    addProcess: (process: ProcessStep) => void;
    updateProcess: (id: string, process: Partial<ProcessStep>) => void;
    removeProcess: (id: string) => void;
    calculateLCA: (product?: Product) => Promise<LCAResults>;
    saveProduct: () => void;
    loadProduct: (id: string) => void;
    resetCalculation: () => void;
  };
}

// Form Data Types
export interface MaterialFormData {
  name: string;
  quantity: number;
  unit: Material['unit'];
  type: Material['type'];
  isRecycled: boolean;
}

export interface ProcessFormData {
  name: string;
  type: ProcessStep['type'];
  energyConsumption: number;
  energyType: ProcessStep['energyType'];
  duration: number;
  distance?: number;
  transportMode?: ProcessStep['transportMode'];
}

// Constants for calculations
export const MATERIAL_FACTORS = {
  aluminum: {
    raw: { carbon: 8.2, energy: 150, water: 1500 },
    recycled: { carbon: 2.1, energy: 45, water: 450 }
  },
  steel: {
    raw: { carbon: 6.5, energy: 125, water: 1200 },
    recycled: { carbon: 1.8, energy: 38, water: 380 }
  },
  plastic: {
    raw: { carbon: 4.8, energy: 85, water: 850 },
    recycled: { carbon: 2.9, energy: 51, water: 510 }
  },
  glass: {
    raw: { carbon: 3.2, energy: 75, water: 750 },
    recycled: { carbon: 1.5, energy: 35, water: 350 }
  },
  paper: {
    raw: { carbon: 2.1, energy: 45, water: 450 },
    recycled: { carbon: 0.8, energy: 18, water: 180 }
  },
  wood: {
    raw: { carbon: 0.5, energy: 15, water: 150 },
    recycled: { carbon: 0.3, energy: 10, water: 100 }
  },
  concrete: {
    raw: { carbon: 5.5, energy: 95, water: 950 },
    recycled: { carbon: 2.2, energy: 38, water: 380 }
  },
  other: {
    raw: { carbon: 3.0, energy: 60, water: 600 },
    recycled: { carbon: 1.5, energy: 30, water: 300 }
  }
} as const;

export const ENERGY_FACTORS = {
  grid: 0.5, // kg CO2e per kWh (average grid electricity)
  renewable: 0.05, // kg CO2e per kWh (renewable energy)
  fossil: 0.8 // kg CO2e per kWh (fossil fuel energy)
} as const;

export const TRANSPORT_FACTORS = {
  truck: 0.12, // kg CO2e per km
  ship: 0.015, // kg CO2e per km
  train: 0.045, // kg CO2e per km
  air: 0.67 // kg CO2e per km
} as const;