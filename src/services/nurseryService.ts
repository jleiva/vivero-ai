import { db, type Nursery } from "../db/db";

class NurseryService {
  /**
   * Get active nursery ID from settings
   */
  async getActiveNurseryId(): Promise<number | null> {
    try {
      const settings = await db.appSettings.toArray();
      return settings.length > 0 && settings[0].activeNurseryId 
        ? settings[0].activeNurseryId 
        : null;
    } catch (error) {
      console.error("Error getting active nursery ID:", error);
      return null;
    }
  }

  /**
   * Set active nursery
   */
  async setActiveNursery(nurseryId: number | null): Promise<void> {
    try {
      const settings = await db.appSettings.toArray();
      
      if (settings.length > 0) {
        await db.appSettings.update(settings[0].id!, {
          activeNurseryId: nurseryId,
          lastUpdated: new Date()
        });
      } else {
        await db.appSettings.add({
          activeNurseryId: nurseryId,
          lastUpdated: new Date()
        });
      }
      
      console.log(`✅ Active nursery set to: ${nurseryId}`);
    } catch (error) {
      console.error("Error setting active nursery:", error);
      throw error;
    }
  }

  /**
   * Check if user has any nurseries
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
   * Get the active nursery
   */
  async getActiveNursery(): Promise<Nursery | null> {
    try {
      const activeId = await this.getActiveNurseryId();
      
      if (!activeId) {
        // No active nursery set, get first one
        const nurseries = await db.nurseries.toArray();
        if (nurseries.length > 0) {
          await this.setActiveNursery(nurseries[0].id!);
          return nurseries[0];
        }
        return null;
      }

      return await db.nurseries.get(activeId);
    } catch (error) {
      console.error("Error getting active nursery:", error);
      return null;
    }
  }

  /**
   * Get all nurseries
   */
  async getAllNurseries(): Promise<Nursery[]> {
    try {
      return await db.nurseries.toArray();
    } catch (error) {
      console.error("Error getting all nurseries:", error);
      return [];
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

      // Set as active if it's the first nursery
      const count = await db.nurseries.count();
      if (count === 1) {
        await this.setActiveNursery(nurseryId);
      }

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
  async updateNursery(nurseryId: number, updates: Partial<Nursery>): Promise<void> {
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
      // Check if this is the active nursery
      const activeId = await this.getActiveNurseryId();
      const isActive = activeId === nurseryId;

      // Delete all associated data
      await db.plantings.where("nurseryId").equals(nurseryId).delete();
      await db.tasks.where("nurseryId").equals(nurseryId).delete();
      await db.inputLogs.where("nurseryId").equals(nurseryId).delete();
      
      // Delete the nursery itself
      await db.nurseries.delete(nurseryId);

      // If this was the active nursery, set another one as active
      if (isActive) {
        const remaining = await db.nurseries.toArray();
        if (remaining.length > 0) {
          await this.setActiveNursery(remaining[0].id!);
        } else {
          // No nurseries left, clear active setting
          await this.setActiveNursery(null);
        }
      }
      
      console.log(`✅ Nursery ${nurseryId} and all data deleted`);
    } catch (error) {
      console.error("Error deleting nursery:", error);
      throw error;
    }
  }

  /**
   * Switch to a different nursery
   */
  async switchNursery(nurseryId: number): Promise<void> {
    try {
      const nursery = await db.nurseries.get(nurseryId);
      if (!nursery) {
        throw new Error(`Nursery ${nurseryId} not found`);
      }

      await this.setActiveNursery(nurseryId);
      console.log(`✅ Switched to nursery: ${nursery.name}`);
    } catch (error) {
      console.error("Error switching nursery:", error);
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