import { db, type Species } from "../db/db";
import speciesData from "../data/species.json";

/**
 * Species Service
 * Handles loading, caching, and retrieving species data
 */
class SpeciesService {
  private initialized = false;
  private loading = false;

  /**
   * Initialize species data - loads from JSON into IndexedDB
   * This should be called once on app startup
   */
  async initialize(): Promise<void> {
    // Prevent multiple simultaneous initializations
    if (this.loading) {
      console.log("⏳ Species initialization already in progress...");
      return;
    }

    if (this.initialized) {
      console.log("✅ Species already initialized");
      return;
    }

    this.loading = true;

    try {
      console.log("🌱 Starting species initialization...");

      // Check if species data already exists
      const existingCount = await db.species.count();

      if (existingCount > 0) {
        console.log(`✅ Species already loaded (${existingCount} species found)`);
        this.initialized = true;
        this.loading = false;
        return;
      }

      // Load species from JSON
      console.log(`📦 Loading ${speciesData.length} species from JSON...`);

      // Bulk insert all species
      await db.species.bulkAdd(speciesData as Species[]);

      const loadedCount = await db.species.count();
      console.log(`✅ Successfully loaded ${loadedCount} species into database`);

      this.initialized = true;
    } catch (error) {
      console.error("❌ Error initializing species data:", error);
      throw new Error(`Failed to initialize species data: ${error.message}`);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Get all species from database
   */
  async getAllSpecies(): Promise<Species[]> {
    try {
      return await db.species.toArray();
    } catch (error) {
      console.error("Error fetching species:", error);
      return [];
    }
  }

  /**
   * Get a single species by ID
   */
  async getSpeciesById(id: number): Promise<Species | undefined> {
    try {
      return await db.species.get(id);
    } catch (error) {
      console.error(`Error fetching species ${id}:`, error);
      return undefined;
    }
  }

  /**
   * Get species by category
   */
  async getSpeciesByCategory(category: string): Promise<Species[]> {
    try {
      return await db.species.where("category").equals(category).toArray();
    } catch (error) {
      console.error(`Error fetching species by category ${category}:`, error);
      return [];
    }
  }

  /**
   * Search species by name
   */
  async searchSpecies(searchTerm: string): Promise<Species[]> {
    try {
      const allSpecies = await db.species.toArray();
      const term = searchTerm.toLowerCase();

      return allSpecies.filter(
        (species) =>
          species.commonName.toLowerCase().includes(term) ||
          species.scientificName.toLowerCase().includes(term)
      );
    } catch (error) {
      console.error("Error searching species:", error);
      return [];
    }
  }

  /**
   * Get nitrogen-fixing species only
   */
  async getNitrogenFixers(): Promise<Species[]> {
    try {
      const allSpecies = await db.species.toArray();
      return allSpecies.filter((species) => species.nitrogenFixer);
    } catch (error) {
      console.error("Error fetching nitrogen fixers:", error);
      return [];
    }
  }

  /**
   * Get native species only
   */
  async getNativeSpecies(): Promise<Species[]> {
    try {
      const allSpecies = await db.species.toArray();
      return allSpecies.filter((species) => species.nativeToRegion);
    } catch (error) {
      console.error("Error fetching native species:", error);
      return [];
    }
  }

  /**
   * Force reload species data (useful for updates)
   */
  async reloadSpecies(): Promise<void> {
    try {
      console.log("🔄 Reloading species data...");

      // Clear existing species
      await db.species.clear();

      // Reset initialization flag
      this.initialized = false;

      // Reinitialize
      await this.initialize();

      console.log("✅ Species data reloaded successfully");
    } catch (error) {
      console.error("Error reloading species:", error);
      throw error;
    }
  }

  /**
   * Get species count
   */
  async getSpeciesCount(): Promise<number> {
    try {
      return await db.species.count();
    } catch (error) {
      console.error("Error getting species count:", error);
      return 0;
    }
  }

  /**
   * Check if species data is loaded
   */
  async isDataLoaded(): Promise<boolean> {
    try {
      const count = await db.species.count();
      return count > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get species statistics
   */
  async getStatistics(): Promise<{
    total: number;
    byCategory: Record<string, number>;
    nitrogenFixers: number;
    nativeSpecies: number;
  }> {
    try {
      const allSpecies = await db.species.toArray();

      // Count by category
      const byCategory: Record<string, number> = {};
      allSpecies.forEach((species) => {
        byCategory[species.category] = (byCategory[species.category] || 0) + 1;
      });

      return {
        total: allSpecies.length,
        byCategory,
        nitrogenFixers: allSpecies.filter((s) => s.nitrogenFixer).length,
        nativeSpecies: allSpecies.filter((s) => s.nativeToRegion).length,
      };
    } catch (error) {
      console.error("Error getting statistics:", error);
      return {
        total: 0,
        byCategory: {},
        nitrogenFixers: 0,
        nativeSpecies: 0,
      };
    }
  }
}

// Export singleton instance
export const speciesService = new SpeciesService();