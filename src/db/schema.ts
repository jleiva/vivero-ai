export interface Nursery {
  id?: number;
  name: string;
  startMonth: number; // 0-11
  region: string;
  createdAt: string;
  }
  
  
  export interface SpeciesPlanting {
  id?: number;
  nurseryId: number;
  speciesId: string;
  quantity: number;
  potSizeGal?: number;
  potDepthCm?: number;
  }
  
  
  export interface Task {
  id?: number;
  nurseryId: number;
  speciesPlantingId?: number;
  date: string; // ISO
  category: string;
  payload?: any;
  status: "pending" | "completed" | "skipped";
  createdAt: string;
  completedAt?: string;
  }
  
  
  export interface BioRecipe {
  id?: string;
  inputType: string;
  steps: string[];
  dilution: string;
  brewDays: number;
  frequencyDays: number;
  }