import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db/db";

export const useTasks = (date?: string) => {
  const today = date ?? new Date().toISOString().slice(0, 10);

  const tasks = useLiveQuery(async () => {
    return await db.tasks
      .where("date")
      .equals(today)
      .sortBy("createdAt");
  }, [today]);

  return tasks ?? [];
};
