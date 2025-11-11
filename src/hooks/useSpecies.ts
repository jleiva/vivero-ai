import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db/db";
import { useEffect, useState } from "react";
import { speciesService } from "../services/speciesService";

/**
 * Hook to get all species (live updates from Dexie)
 */
export function useSpecies() {
  return useLiveQuery(() => db.species.toArray(), []) ?? [];
}

/**
 * Hook to get a single species by ID (live updates)
 */
export function useSpeciesById(id: number | null) {
  return useLiveQuery(
    async () => {
      if (!id) return null;
      return await db.species.get(id);
    },
    [id]
  ) ?? null;
}

/**
 * Hook to search species
 */
export function useSpeciesSearch(searchTerm: string) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchTerm) {
      setResults([]);
      return;
    }

    const search = async () => {
      setLoading(true);
      const species = await speciesService.searchSpecies(searchTerm);
      setResults(species);
      setLoading(false);
    };

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  return { results, loading };
}

/**
 * Hook to get species by category
 */
export function useSpeciesByCategory(category: string) {
  return useLiveQuery(
    async () => {
      if (!category || category === "all") {
        return await db.species.toArray();
      }
      return await db.species.where("category").equals(category).toArray();
    },
    [category]
  ) ?? [];
}

/**
 * Hook to ensure species are loaded
 */
export function useSpeciesInitialization() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        await speciesService.initialize();
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  return { isLoading, error };
}