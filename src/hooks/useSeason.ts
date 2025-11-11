// ============================================
// 2. useSeason.ts - React Hooks for Season
// ============================================
import { useState, useEffect } from "react";
import { seasonService, type SeasonInfo, type Season } from "../services/seasonService";

/**
 * Hook to get current season information
 * Updates automatically when season changes
 */
export function useSeason(region: string = "guanacaste"): SeasonInfo {
  const [seasonInfo, setSeasonInfo] = useState<SeasonInfo>(
    seasonService.getSeasonInfo(region)
  );

  useEffect(() => {
    // Update season info
    const updateSeason = () => {
      setSeasonInfo(seasonService.getSeasonInfo(region));
    };

    updateSeason();

    // Check for season changes daily
    const interval = setInterval(updateSeason, 1000 * 60 * 60 * 24); // Every 24 hours

    return () => clearInterval(interval);
  }, [region]);

  return seasonInfo;
}

/**
 * Hook to get current season (simplified)
 */
export function useCurrentSeason(region: string = "guanacaste"): Season {
  const [season, setSeason] = useState<Season>(
    seasonService.getCurrentSeason(region)
  );

  useEffect(() => {
    const updateSeason = () => {
      setSeason(seasonService.getCurrentSeason(region));
    };

    updateSeason();
    const interval = setInterval(updateSeason, 1000 * 60 * 60 * 24);

    return () => clearInterval(interval);
  }, [region]);

  return season;
}

/**
 * Hook to get watering interval for a species
 */
export function useWateringInterval(
  drySeasonDays: number,
  rainySeasonDays: number,
  region: string = "guanacaste"
): number {
  const season = useCurrentSeason(region);
  
  return seasonService.getWateringInterval(
    drySeasonDays,
    rainySeasonDays,
    region
  );
}