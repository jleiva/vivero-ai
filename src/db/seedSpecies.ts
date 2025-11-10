import { db } from "./db";
import speciesData from "../data/species.json";

export async function seedSpecies() {
  await db.species.bulkAdd(speciesData);
}