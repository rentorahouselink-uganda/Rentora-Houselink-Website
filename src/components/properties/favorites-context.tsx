"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { getFavorites } from "@/lib/api/favorites";

type FavoritesContextType = {
  favoriteIds: Set<string>;
  toggleFavoriteId: (id: string, isSaved: boolean) => void;
};

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  // Fetch favorites from backend whenever the user logs in or refreshes the page
  useEffect(() => {
    if (isAuthenticated) {
      getFavorites()
        .then((favs) => {
          // Extract the property ID from the backend payload
          setFavoriteIds(new Set(favs.map((f: any) => f.id)));
        })
        .catch(console.error);
    } else {
      setFavoriteIds(new Set()); // Clear on logout
    }
  }, [isAuthenticated]);

  // Instantly update the UI across all components
  const toggleFavoriteId = (id: string, isSaved: boolean) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (isSaved) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  return (
    <FavoritesContext.Provider value={{ favoriteIds, toggleFavoriteId }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within a FavoritesProvider");
  return ctx;
}