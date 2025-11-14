import Dexie from "dexie";

// -------- Types --------
export interface Species {
  id?: number;
  commonName: string;
  scientificName: string;
  category: string;
  description: string;
  potSizeMinGal: number;
  potSizeMaxGal: number;
  potDepthCm: number;
  rootBehavior: string;
  wateringDrySeasonDays: number;
  wateringRainySeasonDays: number;
  shadeRequirements: string;
  shadeTolerancePercent: number;
  fertilization: {
    type: string;
    notes: string;
    frequencyDays: number;
    npkRatio: string;
    organicInputs: string[];
  };
  hardeningRules: {
    totalWeeks: number;
    shadeReductionSchedule: Array<{
      week: number;
      shadePercent: number;
      windExposureHours: number;
    }>;
    notes: string;
  };
  transplantReadiness: {
    minHeightCm: number;
    minMonthsInPot: number;
    rootCheckCriteria: string;
    leafMaturity: string;
  };
  commonIssues: string[];
  growthRate: string;
  nativeToRegion: boolean;
  nitrogenFixer: boolean;
}

export interface Nursery {
  id?: number;
  name: string;
  startMonth: number;
  region: string;
  language: string;
  createdAt: Date;
}

export interface AppSettings {
  id?: number;
  activeNurseryId: number | null;
  lastUpdated: Date;
}

export interface Planting {
  id?: number;
  nurseryId: number;
  speciesId: number | null;
  speciesName: string;
  quantity: number;
  potSizeGal: number;
  potDepthCm: number;
  expectedTransplantDate: string | null;
}

export interface Task {
  id?: number;
  nurseryId: number;
  plantingId?: number | null;
  date: string;
  category: string;
  payload: any;
  status: "pending" | "completed" | "skipped";
  createdAt: Date;
  completedAt?: Date | null;
}

export interface InputLog {
  id?: number;
  nurseryId: number;
  taskId?: number | null;
  plantingId?: number | null;
  date: string;
  inputType: string; // "water", "em", "compost_tea", "bokashi", "wood_ash", "fertilizer"
  quantity: number;
  units: string; // "L", "ml", "kg", "g", "cups"
  notes?: string;
  createdAt: Date;
}

// -------- DB Class --------
class NurseryDB extends Dexie {
  species!: Dexie.Table<Species, number>;
  nurseries!: Dexie.Table<Nursery, number>;
  plantings!: Dexie.Table<Planting, number>;
  tasks!: Dexie.Table<Task, number>;
  inputLogs!: Dexie.Table<InputLog, number>;
  appSettings!: Dexie.Table<AppSettings, number>;

  constructor() {
    super("ViveroMaestroDB");

    this.version(2).stores({
      species: "++id, commonName, scientificName, category",
      nurseries: "++id, startMonth, region",
      plantings: "++id, nurseryId, speciesId",
      tasks: "++id, nurseryId, plantingId, date, status",
      inputLogs: "++id, nurseryId, date, inputType",
      appSettings: "++id, activeNurseryId"
    });

    this.species = this.table("species");
    this.nurseries = this.table("nurseries");
    this.plantings = this.table("plantings");
    this.tasks = this.table("tasks");
    this.inputLogs = this.table("inputLogs");
    this.appSettings = this.table("appSettings");
  }
}

export const db = new NurseryDB();