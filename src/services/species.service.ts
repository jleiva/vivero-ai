import speciesData from "../data/species.json";
import { db } from "../db";


export async function seedSpecies() {
  const count = await db.table("bioRecipes").count();
  if (count > 0) return; // Already seeded


  for (const s of speciesData) {
  await db.table("bioRecipes").add(s);
  }
}


export async function getSpecies() {
return speciesData;
}