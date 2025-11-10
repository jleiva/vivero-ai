import Dexie from "dexie";

// -------- Types --------
export interface Species {
  id?: number;
  commonName: string;
  scientificName: string;
  potSizeMinGal: number;
  rootBehavior: string;
  wateringDryDays: number;
  wateringRainyDays: number;
  fertilization: string;
}

export interface Nursery {
  id?: number;
  name: string;
  startMonth: number; // 1-12
  region: string; // "Guanacaste", etc
  language: string; // "es", "en"
  createdAt: Date;
}

export interface Planting {
  id?: number;
  nurseryId: number;
  speciesId: number;
  quantity: number;
  potSizeGal: number;
  potDepthCm: number;
  expectedTransplantDate: Date | null;
}

export interface Task {
  id?: number;
  nurseryId: number;
  plantingId?: number | null;
  date: string; // ISO date
  category: string; // "water", "fertilize", "em", etc
  payload: any; // JSON payload, e.g dosage
  status: "pending" | "completed" | "skipped";
  createdAt: Date;
  completedAt?: Date | null;
}

export interface InputLog {
  id?: number;
  nurseryId: number;
  taskId?: number | null;
  date: string;
  inputType: string; // "EM", "bokashi", etc
  quantity: number;
  units: string; 
  notes?: string;
}

// -------- DB Class --------
class NurseryDB extends Dexie {
  species!: Dexie.Table<Species, number>;
  nurseries!: Dexie.Table<Nursery, number>;
  plantings!: Dexie.Table<Planting, number>;
  tasks!: Dexie.Table<Task, number>;
  inputLogs!: Dexie.Table<InputLog, number>;

  constructor() {
    super("ViveroMaestroDB");

    this.version(1).stores({
      species: "++id, commonName, scientificName",
      nurseries: "++id, startMonth, region",
      plantings: "++id, nurseryId, speciesId",
      tasks: "++id, nurseryId, plantingId, date, status",
      inputLogs: "++id, nurseryId, date, inputType"
    });

    this.species = this.table("species");
    this.nurseries = this.table("nurseries");
    this.plantings = this.table("plantings");
    this.tasks = this.table("tasks");
    this.inputLogs = this.table("inputLogs");
  }
}

export const db = new NurseryDB();
