// ============================================
// 1. nurseryService.ts - Nursery Management Service
// ============================================
import { db, type Nursery } from "../db/db";

class NurseryService {
  /**
   * Check if user has completed nursery setup
   */
  async hasNursery(): Promise<boolean> {
    try {
      const count = await db.nurseries.count();
      return count > 0;
    } catch (error) {
      console.error("Error checking nursery:", error);
      return false;
    }
  }

  /**
   * Get the user's active nursery
   */
  async getActiveNursery(): Promise<Nursery | null> {
    try {
      const nurseries = await db.nurseries.toArray();
      return nurseries.length > 0 ? nurseries[0] : null;
    } catch (error) {
      console.error("Error getting active nursery:", error);
      return null;
    }
  }

  /**
   * Create a new nursery
   */
  async createNursery(data: {
    name: string;
    startMonth: number;
    region: string;
    language?: string;
  }): Promise<number> {
    try {
      const nurseryId = await db.nurseries.add({
        name: data.name,
        startMonth: data.startMonth,
        region: data.region,
        language: data.language || "es",
        createdAt: new Date(),
      });

      console.log(`✅ Nursery created with ID: ${nurseryId}`);
      return nurseryId;
    } catch (error) {
      console.error("Error creating nursery:", error);
      throw error;
    }
  }

  /**
   * Update nursery configuration
   */
  async updateNursery(
    nurseryId: number,
    updates: Partial<Nursery>
  ): Promise<void> {
    try {
      await db.nurseries.update(nurseryId, updates);
      console.log(`✅ Nursery ${nurseryId} updated`);
    } catch (error) {
      console.error("Error updating nursery:", error);
      throw error;
    }
  }

  /**
   * Delete nursery and all associated data
   */
  async deleteNursery(nurseryId: number): Promise<void> {
    try {
      // Delete all associated data
      await db.plantings.where("nurseryId").equals(nurseryId).delete();
      await db.tasks.where("nurseryId").equals(nurseryId).delete();
      await db.inputLogs.where("nurseryId").equals(nurseryId).delete();
      
      // Delete the nursery itself
      await db.nurseries.delete(nurseryId);
      
      console.log(`✅ Nursery ${nurseryId} and all data deleted`);
    } catch (error) {
      console.error("Error deleting nursery:", error);
      throw error;
    }
  }

  /**
   * Get nursery statistics
   */
  async getNurseryStats(nurseryId: number): Promise<{
    totalPlants: number;
    totalSpecies: number;
    pendingTasks: number;
    completedTasks: number;
  }> {
    try {
      const plantings = await db.plantings.where("nurseryId").equals(nurseryId).toArray();
      const tasks = await db.tasks.where("nurseryId").equals(nurseryId).toArray();

      const totalPlants = plantings.reduce((sum, p) => sum + p.quantity, 0);
      const totalSpecies = new Set(plantings.map(p => p.speciesId)).size;
      const pendingTasks = tasks.filter(t => t.status === "pending").length;
      const completedTasks = tasks.filter(t => t.status === "completed").length;

      return {
        totalPlants,
        totalSpecies,
        pendingTasks,
        completedTasks,
      };
    } catch (error) {
      console.error("Error getting nursery stats:", error);
      return {
        totalPlants: 0,
        totalSpecies: 0,
        pendingTasks: 0,
        completedTasks: 0,
      };
    }
  }
}

export const nurseryService = new NurseryService();