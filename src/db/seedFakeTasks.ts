import { db } from "./db";

export async function seedFakeTasks() {
  const taskCount = await db.tasks.count();
  if (taskCount > 0) return; // don't reseed if tasks exist

  const now = new Date();
  const iso = (date: Date) => date.toISOString().split("T")[0];

  const tasks = [
    {
      nurseryId: 1,
      plantingId: null,
      date: iso(now),
      category: "water",
      payload: { volumeLiters: 2, note: "Morning light watering" },
      status: "pending",
      createdAt: new Date()
    },
    {
      nurseryId: 1,
      plantingId: null,
      date: iso(new Date(now.getTime() + 86400000)),
      category: "fertilize",
      payload: { type: "Bokashi tea", dilution: "1:500", liters: 5 },
      status: "pending",
      createdAt: new Date()
    },
    {
      nurseryId: 1,
      plantingId: null,
      date: iso(new Date(now.getTime() + 2 * 86400000)),
      category: "em",
      payload: { dilution: "1:1000", liters: 4, tip: "Apply to moist soil" },
      status: "pending",
      createdAt: new Date()
    },
    {
      nurseryId: 1,
      plantingId: null,
      date: iso(new Date(now.getTime() + 3 * 86400000)),
      category: "hardening",
      payload: { shadePercent: 60, durationHours: 4 },
      status: "pending",
      createdAt: new Date()
    }
  ];

  await db.tasks.bulkAdd(tasks);
  console.log("✅ Seeded fake tasks");
}
