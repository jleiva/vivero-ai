import { db } from "./db";

export async function seedTestNursery() {
  const nurseryExists = await db.nurseries.count();
  if (nurseryExists > 0) return;

  const nurseryId = await db.nurseries.add({
    name: "Test Nursery",
    startMonth: 1,
    timezone: "UTC",
    region: "Guanacaste",
    language: "es",
    createdAt: new Date()
  });

  // Seed species-plantings
  await db.plantings.bulkAdd([
    {
      nurseryId,
      speciesId: 1,
      speciesName: "Mango",
      quantity: 3,
      potSizeGal: 1,
      potDepthCm: 25,
      expectedTransplantDate: "2026-05-15"
    },
    {
      nurseryId,
      speciesId: 2,
      speciesName: "Caoba",
      quantity: 2,
      potSizeGal: 1,
      potDepthCm: 28,
      expectedTransplantDate: "2026-05-15"
    }
  ]);

  console.log("✅ Nursery + sample plantings seeded");
}
