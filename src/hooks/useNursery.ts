// ============================================
// 5. useNursery.ts - React Hook for Nursery
// ============================================
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db/db";
import { useState, useEffect } from "react";
import { nurseryService } from "../services/nurseryService";

/**
 * Hook to get active nursery (live updates from Dexie)
 */
export function useNursery() {
  return useLiveQuery(async () => {
    const nurseries = await db.nurseries.toArray();
    return nurseries.length > 0 ? nurseries[0] : null;
  }) ?? null;
}

/**
 * Hook to check if nursery exists
 */
export function useHasNursery() {
  const [hasNursery, setHasNursery] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      const exists = await nurseryService.hasNursery();
      setHasNursery(exists);
      setIsLoading(false);
    };

    check();
  }, []);

  return { hasNursery, isLoading };
}

/**
 * Hook to get nursery statistics
 */
export function useNurseryStats(nurseryId: number | null) {
  const [stats, setStats] = useState({
    totalPlants: 0,
    totalSpecies: 0,
    pendingTasks: 0,
    completedTasks: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!nurseryId) return;

    const loadStats = async () => {
      const nurseryStats = await nurseryService.getNurseryStats(nurseryId);
      setStats(nurseryStats);
      setIsLoading(false);
    };

    loadStats();
  }, [nurseryId]);

  return { stats, isLoading };
}