import { db } from "./db";
import { getTodayLocal, getDateOffset } from "../utils/dateHelpers";

export async function seedFakeTasks() {
  const taskCount = await db.tasks.count();
  if (taskCount > 0) return; // don't reseed if tasks exist

  const today = getTodayLocal();
  const tomorrow = getDateOffset(1);
  const dayAfterTomorrow = getDateOffset(2);
  const nextWeek = getDateOffset(7);

  const tasks = [
    {
      nurseryId: 1,
      plantingId: null,
      date: today,
      category: "water",
      payload: { dosage: "2L", note: "Morning light watering" },
      status: "pending",
      createdAt: new Date()
    },
    {
      nurseryId: 1,
      plantingId: null,
      date: tomorrow,
      category: "fertilize",
      payload: { type: "Bokashi tea", dilution: "1:500", dosage: "5L" },
      status: "pending",
      createdAt: new Date()
    },
    {
      nurseryId: 1,
      plantingId: null,
      date: dayAfterTomorrow,
      category: "em",
      payload: { dilution: "1:1000", dosage: "4L", note: "Apply to moist soil" },
      status: "pending",
      createdAt: new Date()
    },
    {
      nurseryId: 1,
      plantingId: null,
      date: nextWeek,
      category: "prune",
      payload: { note: "Remove dead branches" },
      status: "pending",
      createdAt: new Date()
    }
  ];

  await db.tasks.bulkAdd(tasks);
  console.log("✅ Seeded fake tasks");
}