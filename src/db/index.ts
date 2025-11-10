import Dexie, { Table } from "dexie";
import { Nursery, SpeciesPlanting, Task, BioRecipe } from "./schema";


export class ViveroDB extends Dexie {
nurseries!: Table<Nursery, number>;
plantings!: Table<SpeciesPlanting, number>;
tasks!: Table<Task, number>;
bioRecipes!: Table<BioRecipe, string>;


constructor() {
super("viveroDB");
this.version(1).stores({
nurseries: "++id, name, startMonth, region",
plantings: "++id, nurseryId, speciesId",
tasks: "++id, nurseryId, date, category, status",
bioRecipes: "id"
});
}
}


export const db = new ViveroDB();