import { db, type InputLog } from "../db/db";

class InputLogService {
  /**
   * Create a new input log
   */
  async createLog(data: {
    nurseryId: number;
    taskId?: number | null;
    plantingId?: number | null;
    date: string;
    inputType: string;
    quantity: number;
    units: string;
    notes?: string;
  }): Promise<number> {
    try {
      const logId = await db.inputLogs.add({
        ...data,
        createdAt: new Date(),
      });
      console.log(`✅ Input log created with ID: ${logId}`);
      return logId;
    } catch (error) {
      console.error("Error creating input log:", error);
      throw error;
    }
  }

  /**
   * Get logs for a specific nursery
   */
  async getLogsByNursery(nurseryId: number, limit?: number): Promise<InputLog[]> {
    try {
      const query = db.inputLogs.where("nurseryId").equals(nurseryId);
      const logs = limit 
        ? await query.reverse().limit(limit).toArray()
        : await query.toArray();
      return logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      console.error("Error fetching logs:", error);
      return [];
    }
  }

  /**
   * Get logs by input type
   */
  async getLogsByType(nurseryId: number, inputType: string): Promise<InputLog[]> {
    try {
      return await db.inputLogs
        .where("nurseryId")
        .equals(nurseryId)
        .and((log) => log.inputType === inputType)
        .toArray();
    } catch (error) {
      console.error("Error fetching logs by type:", error);
      return [];
    }
  }

  /**
   * Get logs for a specific plant
   */
  async getLogsByPlant(plantingId: number): Promise<InputLog[]> {
    try {
      return await db.inputLogs
        .where("plantingId")
        .equals(plantingId)
        .toArray();
    } catch (error) {
      console.error("Error fetching logs by plant:", error);
      return [];
    }
  }

  /**
   * Delete a log
   */
  async deleteLog(logId: number): Promise<void> {
    try {
      await db.inputLogs.delete(logId);
      console.log(`✅ Input log ${logId} deleted`);
    } catch (error) {
      console.error("Error deleting log:", error);
      throw error;
    }
  }

  /**
   * Get statistics for a nursery
   */
  async getStats(nurseryId: number, startDate?: string, endDate?: string) {
    try {
      const logs = await this.getLogsByNursery(nurseryId);
      
      // Filter by date range if provided
      const filteredLogs = logs.filter(log => {
        if (startDate && log.date < startDate) return false;
        if (endDate && log.date > endDate) return false;
        return true;
      });

      // Group by input type
      const byType: Record<string, { count: number; totalQuantity: number }> = {};
      
      filteredLogs.forEach(log => {
        if (!byType[log.inputType]) {
          byType[log.inputType] = { count: 0, totalQuantity: 0 };
        }
        byType[log.inputType].count++;
        byType[log.inputType].totalQuantity += log.quantity;
      });

      return {
        totalLogs: filteredLogs.length,
        byType,
        recentLogs: filteredLogs.slice(0, 10),
      };
    } catch (error) {
      console.error("Error getting stats:", error);
      return { totalLogs: 0, byType: {}, recentLogs: [] };
    }
  }
}

export const inputLogService = new InputLogService();