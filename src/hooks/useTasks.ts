import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db/db";
import { getTodayLocal } from "../utils/dateHelpers";

export const useTasks = (date?: string) => {
  const today = date ?? getTodayLocal();

  const tasks = useLiveQuery(async () => {
    return await db.tasks
      .where("date")
      .equals(today)
      .sortBy("createdAt");
  }, [today]);

  return tasks ?? [];
};