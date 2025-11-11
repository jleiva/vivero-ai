// ============================================
// 1. seasonService.ts - Season Detection Service
// ============================================

/**
 * Season Detection Service
 * 
 * Handles season detection for Costa Rica's North Pacific region (Guanacaste)
 * Determines dry vs rainy season and provides season-specific recommendations
 */

export type Season = "dry" | "rainy" | "transition";

export interface SeasonInfo {
  season: Season;
  seasonName: string;
  month: number;
  monthName: string;
  startDate: Date;
  endDate: Date;
  description: string;
  wateringMultiplier: number;
  recommendations: string[];
  nextSeasonChange: {
    season: Season;
    date: Date;
    daysUntil: number;
  };
}

export interface RegionConfig {
  region: string;
  drySeason: {
    startMonth: number; // 1-12
    endMonth: number;
  };
  rainySeason: {
    startMonth: number;
    endMonth: number;
  };
  transitionMonths?: number[];
}

// Regional configurations
const REGIONS: Record<string, RegionConfig> = {
  guanacaste: {
    region: "Guanacaste",
    drySeason: {
      startMonth: 12, // December
      endMonth: 4,    // April
    },
    rainySeason: {
      startMonth: 5,  // May
      endMonth: 11,   // November
    },
    transitionMonths: [], // Optional: months between seasons
  },
  // Can add more regions in the future
  "central-valley": {
    region: "Valle Central",
    drySeason: {
      startMonth: 12,
      endMonth: 4,
    },
    rainySeason: {
      startMonth: 5,
      endMonth: 11,
    },
  },
};

class SeasonService {
  private defaultRegion: string = "guanacaste";

  /**
   * Get the current season for a specific region
   */
  getCurrentSeason(region: string = this.defaultRegion, date: Date = new Date()): Season {
    const config = REGIONS[region.toLowerCase()];
    if (!config) {
      console.warn(`Region '${region}' not found, using default (Guanacaste)`);
      return this.getCurrentSeason(this.defaultRegion, date);
    }

    const month = date.getMonth() + 1; // JavaScript months are 0-indexed

    // Check if in transition period
    if (config.transitionMonths && config.transitionMonths.includes(month)) {
      return "transition";
    }

    // Handle wrap-around (Dec-Apr for dry season)
    if (config.drySeason.startMonth > config.drySeason.endMonth) {
      // Dry season wraps around year end
      if (month >= config.drySeason.startMonth || month <= config.drySeason.endMonth) {
        return "dry";
      }
    } else {
      // Normal range
      if (month >= config.drySeason.startMonth && month <= config.drySeason.endMonth) {
        return "dry";
      }
    }

    return "rainy";
  }

  /**
   * Get detailed season information
   */
  getSeasonInfo(region: string = this.defaultRegion, date: Date = new Date()): SeasonInfo {
    const season = this.getCurrentSeason(region, date);
    const month = date.getMonth() + 1;
    const config = REGIONS[region.toLowerCase()] || REGIONS[this.defaultRegion];

    // Season names in Spanish
    const seasonNames: Record<Season, string> = {
      dry: "Temporada Seca",
      rainy: "Temporada Lluviosa",
      transition: "Transición",
    };

    // Month names in Spanish
    const monthNames = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    // Season descriptions
    const descriptions: Record<Season, string> = {
      dry: "Período seco con poca lluvia. Aumenta frecuencia de riego y monitoreo de humedad.",
      rainy: "Período lluvioso con precipitaciones frecuentes. Reduce riego y mejora drenaje.",
      transition: "Período de transición entre temporadas. Ajusta riego según condiciones.",
    };

    // Watering multipliers (relative to base frequency)
    const wateringMultipliers: Record<Season, number> = {
      dry: 1.5,      // Water more frequently in dry season
      rainy: 0.5,    // Water less frequently in rainy season
      transition: 1.0,
    };

    // Season-specific recommendations
    const recommendations: Record<Season, string[]> = {
      dry: [
        "Aumenta la frecuencia de riego",
        "Verifica la humedad del sustrato diariamente",
        "Considera mulch para retener humedad",
        "Riega temprano en la mañana o tarde",
        "Monitorea signos de estrés hídrico",
      ],
      rainy: [
        "Reduce la frecuencia de riego",
        "Asegura buen drenaje en macetas",
        "Protege plantas de lluvia excesiva si es necesario",
        "Monitorea signos de exceso de humedad",
        "Aumenta aplicación de EM para prevenir hongos",
      ],
      transition: [
        "Ajusta riego según condiciones climáticas",
        "Prepara para cambio de temporada",
        "Monitorea pronóstico del tiempo",
        "Ajusta fertilización según necesidad",
      ],
    };

    // Calculate season boundaries
    const { startDate, endDate } = this.getSeasonBoundaries(season, config, date);

    // Calculate next season change
    const nextSeasonChange = this.getNextSeasonChange(season, config, date);

    return {
      season,
      seasonName: seasonNames[season],
      month,
      monthName: monthNames[month - 1],
      startDate,
      endDate,
      description: descriptions[season],
      wateringMultiplier: wateringMultipliers[season],
      recommendations: recommendations[season],
      nextSeasonChange,
    };
  }

  /**
   * Get season boundaries (start and end dates)
   */
  private getSeasonBoundaries(
    season: Season,
    config: RegionConfig,
    date: Date
  ): { startDate: Date; endDate: Date } {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    let startMonth: number;
    let endMonth: number;

    if (season === "dry") {
      startMonth = config.drySeason.startMonth;
      endMonth = config.drySeason.endMonth;
    } else {
      startMonth = config.rainySeason.startMonth;
      endMonth = config.rainySeason.endMonth;
    }

    // Handle year wrap-around for dry season
    let startYear = year;
    let endYear = year;

    if (startMonth > endMonth) {
      // Dry season wraps around year
      if (month < startMonth) {
        startYear = year - 1;
      } else {
        endYear = year + 1;
      }
    }

    const startDate = new Date(startYear, startMonth - 1, 1);
    const endDate = new Date(endYear, endMonth, 0); // Last day of end month

    return { startDate, endDate };
  }

  /**
   * Calculate when the next season change will occur
   */
  private getNextSeasonChange(
    currentSeason: Season,
    config: RegionConfig,
    date: Date
  ): { season: Season; date: Date; daysUntil: number } {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    let nextSeasonStartMonth: number;
    let nextSeason: Season;

    if (currentSeason === "dry") {
      nextSeasonStartMonth = config.rainySeason.startMonth;
      nextSeason = "rainy";
    } else {
      nextSeasonStartMonth = config.drySeason.startMonth;
      nextSeason = "dry";
    }

    // Calculate year for next season
    let nextYear = year;
    if (month >= nextSeasonStartMonth && currentSeason === "rainy") {
      // Next dry season is next year
      nextYear = year + 1;
    } else if (month < nextSeasonStartMonth && currentSeason === "dry") {
      // Next rainy season is this year
      nextYear = year;
    } else if (month >= nextSeasonStartMonth && currentSeason === "dry") {
      // Already past rainy season start, next one is next year
      nextYear = year + 1;
    }

    const nextSeasonDate = new Date(nextYear, nextSeasonStartMonth - 1, 1);
    const daysUntil = Math.ceil((nextSeasonDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    return {
      season: nextSeason,
      date: nextSeasonDate,
      daysUntil,
    };
  }

  /**
   * Get watering interval for a species based on current season
   */
  getWateringInterval(
    speciesWateringDry: number,
    speciesWateringRainy: number,
    region: string = this.defaultRegion,
    date: Date = new Date()
  ): number {
    const season = this.getCurrentSeason(region, date);

    if (season === "dry") {
      return speciesWateringDry;
    } else if (season === "rainy") {
      return speciesWateringRainy;
    } else {
      // Transition: average of both
      return Math.round((speciesWateringDry + speciesWateringRainy) / 2);
    }
  }

  /**
   * Check if a specific date is in dry season
   */
  isDrySeason(region: string = this.defaultRegion, date: Date = new Date()): boolean {
    return this.getCurrentSeason(region, date) === "dry";
  }

  /**
   * Check if a specific date is in rainy season
   */
  isRainySeason(region: string = this.defaultRegion, date: Date = new Date()): boolean {
    return this.getCurrentSeason(region, date) === "rainy";
  }

  /**
   * Get all available regions
   */
  getAvailableRegions(): string[] {
    return Object.keys(REGIONS);
  }

  /**
   * Get region configuration
   */
  getRegionConfig(region: string): RegionConfig | null {
    return REGIONS[region.toLowerCase()] || null;
  }

  /**
   * Get season for a specific month (useful for planning)
   */
  getSeasonForMonth(month: number, region: string = this.defaultRegion): Season {
    const date = new Date(new Date().getFullYear(), month - 1, 15); // Middle of month
    return this.getCurrentSeason(region, date);
  }

  /**
   * Get season calendar for the full year
   */
  getYearlySeasonCalendar(region: string = this.defaultRegion): Array<{
    month: number;
    monthName: string;
    season: Season;
    seasonName: string;
  }> {
    const monthNames = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const seasonNames: Record<Season, string> = {
      dry: "Seca",
      rainy: "Lluviosa",
      transition: "Transición",
    };

    return monthNames.map((monthName, index) => {
      const month = index + 1;
      const season = this.getSeasonForMonth(month, region);
      
      return {
        month,
        monthName,
        season,
        seasonName: seasonNames[season],
      };
    });
  }
}

// Export singleton instance
export const seasonService = new SeasonService();