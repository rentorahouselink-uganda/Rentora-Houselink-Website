"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { getFavorites } from "@/lib/api/favorites";

type FavoritesContextType = {
  ready: boolean;
  favoriteIds: Set<string>;
  refreshFavorites: () => Promise<void>;
  toggleFavoriteId: (id: string, isSaved: boolean) => void;
};

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [ready, setReady] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  const refreshFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavoriteIds(new Set());
      setReady(true);
      return;
    }

    setReady(false);

    try {
      const ids = await getFavorites();
      setFavoriteIds(new Set(ids));
    } catch (error) {
      console.error("Failed to load favorites:", error);
      setFavoriteIds(new Set());
    } finally {
      setReady(true);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void refreshFavorites();
  }, [refreshFavorites]);

  const toggleFavoriteId = useCallback((id: string, isSaved: boolean) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (isSaved) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      ready,
      favoriteIds,
      refreshFavorites,
      toggleFavoriteId,
    }),
    [ready, favoriteIds, refreshFavorites, toggleFavoriteId],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within a FavoritesProvider");
  return ctx;
}